"use client";

import { useLiveList } from '@/hooks/useLiveList';
import { inferCategoryWithAI } from '@/lib/categoryDictionary';
import { useState } from 'react';

export default function ListPage({ params }: { params: { id: string } }) {
  const { items, addItem } = useLiveList(params.id);
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = async () => {
    if (!newItem.trim() || isAdding) return;
    setIsAdding(true);
    try {
      const category = await inferCategoryWithAI(newItem);
      await addItem({ list_id: params.id, name: newItem, is_checked: false, notes: category });
      setNewItem('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <input value={newItem} onChange={e => setNewItem(e.target.value)} disabled={isAdding} />
      <button onClick={handleAddItem} disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add'}
      </button>
      <ul>
        {items.map(i => <li key={i.id}>{i.name}</li>)}
      </ul>
    </div>
  );
}
