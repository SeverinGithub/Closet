const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const URL_BASE = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

const PROMPT = (name, cat) => `
You are a fashion expert AI. Analyze this clothing item and return a JSON object with exactly these fields:

- colors: array of specific color names (e.g. ["navy", "cream", "gold-button"])
- style_tags: array of style/vibe descriptors (e.g. ["minimalist", "preppy", "old-money", "streetwear", "coastal"])
- occasion_tags: array — only values from: ["casual", "office", "dinner", "party", "sport", "beach", "date", "travel"]
- fit: single string — only from: ["slim", "regular", "relaxed", "oversized", "cropped"]
- material: single string (e.g. "denim", "cotton", "linen", "leather", "knit", "silk", "wool", "synthetic", "cashmere")
- season: array — only values from: ["spring", "summer", "autumn", "winter"]

Context: category is "${cat}", the user named it "${name}".
Return ONLY valid JSON, no explanation, no markdown.
`.trim();

export async function generateOutfitWithGemini({ items, weather, vibe, occasion }) {
  const itemList = items.map((it) => ({
    id: it.id, name: it.name, cat: it.cat,
    colors: it.colors, style_tags: it.style_tags,
    occasion_tags: it.occasion_tags, fit: it.fit,
    material: it.material, season: it.season,
  }));

  const prompt = `
You are an expert fashion stylist AI. Build the best possible outfit from the wardrobe items below.

WEATHER: ${weather.temp}°C, ${weather.desc}, wind ${weather.wind} m/s, city: ${weather.city}
VIBE: ${vibe}
OCCASION: ${occasion || 'general'}

WARDROBE (JSON):
${JSON.stringify(itemList, null, 2)}

Rules:
- Pick 2–5 items that work together as a complete outfit
- Consider the weather (temperature, rain/sun) when choosing materials and layers
- Match the vibe and occasion
- Avoid clashing colors or incompatible styles
- Prefer items with matching occasion_tags and style_tags

Return a JSON object with:
- item_ids: array of selected item IDs (strings)
- name: a short creative outfit name (max 4 words)
- reason: one sentence explaining why this works (in the user's style context)

Return ONLY valid JSON, no explanation, no markdown.
`.trim();

  const res = await fetch(URL_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no content');
  return JSON.parse(text);
}

export async function tagItemWithGemini({ base64DataUrl, name, cat }) {
  const base64 = base64DataUrl.split(',')[1];

  const res = await fetch(URL_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: PROMPT(name, cat) },
          { inlineData: { mimeType: 'image/jpeg', data: base64 } },
        ],
      }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${res.status}: ${text}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no content');

  return JSON.parse(text);
}
