import fs from "fs";
import path from "path";
import pLimit from "p-limit";

async function fetchJson(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      if (i === retries - 1) {
        throw err;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

const list = await fetchJson(
  "https://pokeapi.co/api/v2/pokemon?limit=2000"
);

const limit = pLimit(10);

const pokemon = await Promise.all(
  list.results.map((p: { name: string; url: string }) =>
    limit(async () => {
      const id = p.url.split("/").filter(Boolean).pop();

      const data = await fetchJson(
        `https://pokeapi.co/api/v2/pokemon/${id}`
      );

			return {
				id: data.id,
				name: data.name,
				sprite: data.sprites.front_default ?? data.sprites.other?.["official-artwork"]?.front_default ?? null,
				types: data.types.map((t: any) => t.type.name),
			};
    })
  )
);

const outputDir = path.join(process.cwd(), "data");
fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  path.join(outputDir, "pokemon.json"),
  JSON.stringify(pokemon, null, 2)
);

console.log(`Saved ${pokemon.length} Pokémon`);
