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

const smogonNames = [...text.matchAll(/^\t\w+: \{[^}]*name: "([^"]+)"/gms)].map(m => m[1]);

console.log(`Found ${smogonNames.length} Smogon items`);

const toPokeApiFormat = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

const pokeApiList = await fetchJson('https://pokeapi.co/api/v2/item?limit=3000');
const pokeApiMap: Record<string, string> = {};
for (const item of pokeApiList.results) {
  pokeApiMap[item.name] = item.url;
}

const limit = pLimit(10);

const results = await Promise.all(
  smogonNames.map(name =>
    limit(async () => {
      const key = toPokeApiFormat(name);
      const url = pokeApiMap[key];
      if (!url) {
        console.log(`Not in PokeAPI: "${name}" → "${key}"`);
        return null;
      }

      try {
        const data = await fetchJson(url);
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
      } catch (err) {
        console.log(`Failed to fetch: "${name}" → "${key}" — ${err}`);
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
