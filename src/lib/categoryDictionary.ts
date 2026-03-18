export const CATEGORY_COLORS: Record<string, string> = {
  Produce: '#22c55e',
  Dairy: '#3b82f6',
  Meat: '#ef4444',
  Bakery: '#f59e0b',
  Frozen: '#06b6d4',
  Beverages: '#8b5cf6',
  Snacks: '#f97316',
  Pantry: '#a855f7',
  Cleaning: '#14b8a6',
  General: '#6b7280',
};

const dictionary: Record<string, string> = {
  apple: 'Produce',
  banana: 'Produce',
  carrot: 'Produce',
  milk: 'Dairy',
  cheese: 'Dairy',
  chicken: 'Meat',
  beef: 'Meat',
  bread: 'Bakery',
  pizza: 'Frozen',
  water: 'Beverages',
  chips: 'Snacks',
  rice: 'Pantry',
  soap: 'Cleaning',
};

export function inferCategory(itemName: string): string {
  const lowerName = itemName.toLowerCase();
  for (const [key, category] of Object.entries(dictionary)) {
    if (lowerName.includes(key)) return category;
  }
  return 'General';
}

export async function inferCategoryWithAI(itemName: string): Promise<string> {
  const localCategory = inferCategory(itemName);

  // Only call AI if local dictionary doesn't know it
  if (localCategory !== 'General') {
    return localCategory;
  }

  try {
    // Only fetch if running in browser (it's safe as it's an absolute path relative to origin, or handled by next config)
    // Next.js client component handles this.
    const res = await fetch('/api/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemName }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.category || 'General';
    }
  } catch (error) {
    console.error('Failed to get AI category:', error);
  }

  return 'General';
}
