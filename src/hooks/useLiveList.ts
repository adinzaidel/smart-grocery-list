import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { itemsService } from '@/lib/services/itemsService';
import { useOfflineSync } from './useOfflineSync';
import { Item } from '@/types/database';

export function useLiveList(listId: string) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOffline, addActionToQueue } = useOfflineSync();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function fetchItems() {
      try {
        setIsLoading(true);
        const fetchedItems = await itemsService.getItems(listId);
        if (isMounted) {
          setItems(fetchedItems);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch items');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (listId) {
      fetchItems();
    }

    return () => {
      isMounted = false;
    };
  }, [listId]);

  useEffect(() => {
    if (!listId) return;

    const channel = supabase
      .channel(`items-changes-${listId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items', filter: `list_id=eq.${listId}` },
        (payload) => {
          setItems((currentItems) => {
            if (payload.eventType === 'INSERT') {
              // Ensure we don't add duplicates if optimistic update already added it
              const exists = currentItems.some((item) => item.id === payload.new.id);
              if (exists) return currentItems;
              return [...currentItems, payload.new as Item];
            }
            if (payload.eventType === 'UPDATE') {
              return currentItems.map((item) => {
                if (item.id === payload.new.id) {
                  // Conflict resolution: last write wins based on updated_at
                  const currentUpdated = item.updated_at ? new Date(item.updated_at).getTime() : 0;
                  const newUpdated = payload.new.updated_at ? new Date(payload.new.updated_at).getTime() : 0;

                  if (newUpdated >= currentUpdated) {
                    return payload.new as Item;
                  }
                  return item;
                }
                return item;
              });
            }
            if (payload.eventType === 'DELETE') {
              return currentItems.filter((item) => item.id !== payload.old.id);
            }
            return currentItems;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listId, supabase]);

  const addItem = useCallback(async (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
    // Optimistic update (with permanent ID generated on client)
    const id = crypto.randomUUID();
    const optimisticItem: Item = {
      ...item,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setItems((prev) => [...prev, optimisticItem]);

    const payload = { ...item, id };

    if (isOffline) {
      addActionToQueue({ id, type: 'INSERT', payload });
    } else {
      try {
        const newItem = await itemsService.insertItem(payload);
        // Replace optimistic item with actual from DB to get the correct timestamps if needed
        setItems((prev) => prev.map((i) => (i.id === id ? newItem : i)));
      } catch (err) {
        console.error('Failed to add item', err);
        // We do not revert on failure since it acts like an offline mode
        // Add to queue to retry later since we failed
        addActionToQueue({ id, type: 'INSERT', payload });
      }
    }
  }, [isOffline, addActionToQueue]);

  const updateItem = useCallback(async (id: string, updates: Partial<Item>) => {
    const updatedTimestamp = new Date().toISOString();
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates, updated_at: updatedTimestamp } : item))
    );

    if (isOffline) {
      addActionToQueue({ id, type: 'UPDATE', payload: updates });
    } else {
      try {
        await itemsService.updateItem(id, updates);
      } catch (err) {
        console.error('Failed to update item', err);
        // Add to queue to retry later
        addActionToQueue({ id, type: 'UPDATE', payload: updates });
      }
    }
  }, [isOffline, addActionToQueue]);

  const toggleItemCheck = useCallback((id: string, is_checked: boolean) => {
    updateItem(id, { is_checked });
  }, [updateItem]);

  const deleteItem = useCallback(async (id: string) => {
    // Optimistic update
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (isOffline) {
      addActionToQueue({ id, type: 'DELETE', payload: null });
    } else {
      try {
        await itemsService.deleteItem(id);
      } catch (err) {
        console.error('Failed to delete item', err);
        addActionToQueue({ id, type: 'DELETE', payload: null });
      }
    }
  }, [isOffline, addActionToQueue]);

  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    toggleItemCheck,
    deleteItem,
  };
}