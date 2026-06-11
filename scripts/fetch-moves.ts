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

const list = await fetchJson("https://pokeapi.co/api/v2/move?limit=1000");
const limit = pLimit(10);

const moves = await Promise.all(
  list.results.map((m: { name: string; url: string }) =>
    limit(async () => {
      const data = await fetchJson(m.url);

      const englishEffect = data.effect_entries.find(
        (e: any) => e.language.name === "en"
      );
      const englishFlavorText = data.flavor_text_entries.findLast(
        (e: any) => e.language.name === "en"
      );

      return {
        id: data.id,
        name: data.name,
        type: data.type.name,
        pp: data.pp,
        power: data.power,
        accuracy: data.accuracy,
        priority: data.priority,
        damage_class: data.damage_class.name,
        effect_chance: data.effect_chance,
        effect: englishEffect?.short_effect ?? null,
        flavor_text: englishFlavorText?.flavor_text ?? null,
        target: data.target.name,
        meta: {
          ailment: data.meta?.ailment?.name ?? null,
          category: data.meta?.category?.name ?? null,
          min_hits: data.meta?.min_hits ?? null,
          max_hits: data.meta?.max_hits ?? null,
          drain: data.meta?.drain ?? 0,
          healing: data.meta?.healing ?? 0,
          crit_rate: data.meta?.crit_rate ?? 0,
          stat_chance: data.meta?.stat_chance ?? 0,
        },
      };
    })
  )
);

const outputDir = path.join(process.cwd(), "data");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  path.join(outputDir, "moves.json"),
  JSON.stringify(moves, null, 2)
);

console.log(`Saved ${moves.length} moves`);
