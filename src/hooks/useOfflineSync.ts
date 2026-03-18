import { useState, useEffect, useCallback } from 'react';
import { itemsService } from '@/lib/services/itemsService';
import { Item } from '@/types/database';

type ActionType = 'INSERT' | 'UPDATE' | 'DELETE';

interface PendingAction {
  id: string; // unique ID for the action (can use item id or a generated uuid for inserts)
  type: ActionType;
  payload: any;
  timestamp: string;
}

export function useOfflineSync() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      flushQueue();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Initial state check
    if (typeof window !== 'undefined') {
      setIsOffline(!window.navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const getQueue = (): PendingAction[] => {
    if (typeof window === 'undefined') return [];
    const queue = localStorage.getItem('pendingActions');
    return queue ? JSON.parse(queue) : [];
  };

  const saveQueue = (queue: PendingAction[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingActions', JSON.stringify(queue));
    }
  };

  const addActionToQueue = useCallback((action: Omit<PendingAction, 'timestamp'>) => {
    const queue = getQueue();
    const newAction: PendingAction = {
      ...action,
      timestamp: new Date().toISOString(),
    };

    // For updates on the same item, we can potentially squash them,
    // but for simplicity and robust last-write-wins on server, we append.
    queue.push(newAction);
    saveQueue(queue);
  }, []);

  const flushQueue = useCallback(async () => {
    if (isSyncing || typeof window === 'undefined') return;

    let queue = getQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);

    try {
      // Process actions sequentially to maintain order
      // Iterate while there are items, removing them as they succeed
      while (queue.length > 0) {
        const action = queue[0];
        try {
          switch (action.type) {
            case 'INSERT':
              await itemsService.insertItem(action.payload as Omit<Item, 'created_at' | 'updated_at'>);
              break;
            case 'UPDATE':
              await itemsService.updateItem(action.id, action.payload as Partial<Item>);
              break;
            case 'DELETE':
              await itemsService.deleteItem(action.id);
              break;
          }
          // Remove the successfully processed action
          queue.shift();
        } catch (error) {
          console.error(`Failed to sync action: ${action.type} for item ${action.id}`, error);
          // If a network error occurs, break and retry later
          break;
        }
      }

      // Save whatever is left (could be empty or contain remaining items if an error broke the loop)
      saveQueue(queue);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  // Attempt to sync on mount if online and there are pending actions
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator.onLine) {
      flushQueue();
    }
  }, [flushQueue]);

  return {
    isOffline,
    isSyncing,
    addActionToQueue,
    flushQueue,
  };
}