import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { itemName } = await request.json();

    if (!itemName) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Falling back to General.');
      return NextResponse.json({ category: 'General' });
    }

    const prompt = `You are a grocery store categorizer. Given this item name, return ONLY one of these categories: Produce, Dairy, Meat, Bakery, Frozen, Beverages, Snacks, Pantry, Cleaning, General. Item: ${itemName}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ category: 'General' }); // Fallback on error
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'General';

    // Ensure the output is exactly one of our categories
    const validCategories = ['Produce', 'Dairy', 'Meat', 'Bakery', 'Frozen', 'Beverages', 'Snacks', 'Pantry', 'Cleaning', 'General'];
    const category = validCategories.find(c => c.toLowerCase() === candidateText.toLowerCase()) || 'General';

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error in categorization route:', error);
    return NextResponse.json({ category: 'General' });
  }
}
