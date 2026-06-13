import fs from "fs";
import path from "path";
import pLimit from "p-limit";

async function fetchJson(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

const smogonRes = await fetch('https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/items.ts');
const text = await smogonRes.text();
const keys = [...text.matchAll(/^\t(\w+): \{/gm)].map(m => m[1]);
console.log(`Found ${keys.length} Smogon items`);

const limit = pLimit(10);

const results = await Promise.all(
  keys.map(key =>
    limit(async () => {
      try {
        const data = await fetchJson(`https://pokeapi.co/api/v2/item/${key}`);
        
        const englishEffect = data.effect_entries?.find(
          (e: any) => e.language.name === 'en'
        );
        const englishFlavor = data.flavor_text_entries?.findLast(
          (e: any) => e.language.name === 'en'
        );

        return {
          id: data.id,
          name: data.name,
          sprite: data.sprites?.default ?? null,
          category: data.category?.name ?? null,
          fling_power: data.fling_power ?? null,
          fling_effect: data.fling_effect?.name ?? null,
          attributes: data.attributes?.map((a: any) => a.name) ?? [],
          effect: englishEffect?.short_effect ?? null,
          flavor_text: englishFlavor?.text ?? null,
        };
      } catch {
        return null;
      }
    })
  )
);

const items = results.filter(Boolean);

fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
fs.writeFileSync(
  path.join(process.cwd(), 'data/items.json'),
  JSON.stringify(items, null, 2)
);

console.log(`Saved ${items.length} items`);
