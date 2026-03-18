"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CATEGORY_COLORS } from '@/lib/categoryDictionary';
import { PantryItem, List } from '@/types/database';

export default function PantryPage() {
  const router = useRouter();
  const supabase = createClient();

  const [items, setItems] = useState<PantryItem[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  // New item form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newQuantity, setNewQuantity] = useState(1);
  const [newExpiration, setNewExpiration] = useState('');

  // Edit quantity state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editQuantityValue, setEditQuantityValue] = useState<number>(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        router.push('/login');
        return;
      }

      const userId = userData.user.id;

      const [pantryRes, listsRes] = await Promise.all([
        supabase
          .from('pantry_items')
          .select('*')
          .eq('user_id', userId)
          .order('name'),
        supabase
          .from('lists')
          .select('*')
          .eq('owner_id', userId)
      ]);

      if (pantryRes.error) throw pantryRes.error;
      if (listsRes.error) throw listsRes.error;

      setItems(pantryRes.data || []);
      setLists(listsRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const newItemData = {
        user_id: userData.user.id,
        name: newName.trim(),
        category: newCategory,
        quantity: newQuantity,
        expiration_date: newExpiration || null,
      };

      const { data, error } = await supabase
        .from('pantry_items')
        .insert(newItemData)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setItems(prev => [...prev, data]);
        // Reset form
        setNewName('');
        setNewCategory('General');
        setNewQuantity(1);
        setNewExpiration('');
      }
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const startEditingQuantity = (item: PantryItem) => {
    setEditingItemId(item.id);
    setEditQuantityValue(item.quantity);
  };

  const saveQuantity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pantry_items')
        .update({ quantity: editQuantityValue })
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: editQuantityValue } : item));
      setEditingItemId(null);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const addToShoppingList = async (item: PantryItem, listId: string) => {
    if (!listId) return;
    try {
      const { error } = await supabase
        .from('items')
        .insert({
          list_id: listId,
          name: item.name,
          notes: item.category,
          is_checked: false
        });

      if (error) throw error;
      alert(`Added ${item.name} to list!`);
    } catch (err) {
      console.error('Error adding to shopping list:', err);
      alert('Failed to add to shopping list.');
    }
  };

  const getExpirationStatus = (dateString?: string | null) => {
    if (!dateString) return null;

    const expDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'expiring';
    return 'ok';
  };

  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, PantryItem[]>);

  if (loading) {
    return <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>Loading pantry...</div>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f4fbf4', minHeight: '100vh', color: '#333' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534' }}>My Pantry</h1>
        <button
          onClick={() => router.push('/dashboard')}
          style={{ padding: '0.5rem 1rem', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </header>

      {/* Add Item Form */}
      <section style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Add New Item</h2>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 200px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Name</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Category</label>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            >
              {Object.keys(CATEGORY_COLORS).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '0 1 80px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Qty</label>
            <input
              type="number"
              min="1"
              value={newQuantity}
              onChange={e => setNewQuantity(parseInt(e.target.value) || 1)}
              required
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: '1 1 150px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Expiration (Optional)</label>
            <input
              type="date"
              value={newExpiration}
              onChange={e => setNewExpiration(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>

          <button
            type="submit"
            style={{ padding: '0.5rem 1.5rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', height: '38px' }}
          >
            Add
          </button>
        </form>
      </section>

      {/* Inventory List Grouped by Category */}
      {Object.keys(groupedItems).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>Your pantry is empty.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(groupedItems).map(([category, catItems]) => (
            <div key={category} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{
                background: CATEGORY_COLORS[category] || CATEGORY_COLORS['General'],
                color: 'white',
                padding: '0.75rem 1rem',
                fontWeight: 600
              }}>
                {category}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {catItems.map(item => {
                  const status = getExpirationStatus(item.expiration_date);
                  let bgColor = 'transparent';
                  if (status === 'expired') bgColor = '#fee2e2'; // Light red
                  if (status === 'expiring') bgColor = '#ffedd5'; // Light orange

                  return (
                    <li key={item.id} style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: bgColor,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>

                        {/* Edit / Delete actions */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => deleteItem(item.id)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                        {/* Quantity Edit */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          Qty:
                          {editingItemId === item.id ? (
                            <>
                              <input
                                type="number"
                                min="0"
                                value={editQuantityValue}
                                onChange={e => setEditQuantityValue(parseInt(e.target.value) || 0)}
                                style={{ width: '50px', padding: '0.25rem' }}
                              />
                              <button onClick={() => saveQuantity(item.id)} style={{ padding: '0.25rem 0.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer' }}>Save</button>
                            </>
                          ) : (
                            <>
                              <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                              <button onClick={() => startEditingQuantity(item)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                            </>
                          )}
                        </div>

                        {/* Expiration */}
                        {item.expiration_date && (
                          <span style={{
                            color: status === 'expired' ? '#b91c1c' : status === 'expiring' ? '#c2410c' : 'inherit',
                            fontWeight: status !== 'ok' ? 600 : 'normal'
                          }}>
                            Exp: {new Date(item.expiration_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Add to list */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <select
                          id={`list-select-${item.id}`}
                          style={{ padding: '0.25rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem', flex: 1 }}
                        >
                          <option value="">Select list...</option>
                          {lists.map(list => (
                            <option key={list.id} value={list.id}>{list.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            const selectEl = document.getElementById(`list-select-${item.id}`) as HTMLSelectElement;
                            addToShoppingList(item, selectEl.value);
                          }}
                          style={{ padding: '0.25rem 0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                          Add to List
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
