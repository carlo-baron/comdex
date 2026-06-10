export type PokemonStatNameType = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';
export type NatureName = typeof natures[number]['name'];
export type PokemonNatureType = {
  name: string;
  increased: PokemonStatNameType | null;
  decreased: PokemonStatNameType | null;
};
export const natures: PokemonNatureType[] = [
  { name: 'hardy',   increased: null,               decreased: null },
  { name: 'lonely',  increased: 'attack',           decreased: 'defense' },
  { name: 'brave',   increased: 'attack',           decreased: 'speed' },
  { name: 'adamant', increased: 'attack',           decreased: 'special-attack' },
  { name: 'naughty', increased: 'attack',           decreased: 'special-defense' },
  { name: 'bold',    increased: 'defense',          decreased: 'attack' },
  { name: 'docile',  increased: null,               decreased: null },
  { name: 'relaxed', increased: 'defense',          decreased: 'speed' },
  { name: 'impish',  increased: 'defense',          decreased: 'special-attack' },
  { name: 'lax',     increased: 'defense',          decreased: 'special-defense' },
  { name: 'timid',   increased: 'speed',            decreased: 'attack' },
  { name: 'hasty',   increased: 'speed',            decreased: 'defense' },
  { name: 'serious', increased: null,               decreased: null },
  { name: 'jolly',   increased: 'speed',            decreased: 'special-attack' },
  { name: 'naive',   increased: 'speed',            decreased: 'special-defense' },
  { name: 'modest',  increased: 'special-attack',   decreased: 'attack' },
  { name: 'mild',    increased: 'special-attack',   decreased: 'defense' },
  { name: 'quiet',   increased: 'special-attack',   decreased: 'speed' },
  { name: 'bashful', increased: null,               decreased: null },
  { name: 'rash',    increased: 'special-attack',   decreased: 'special-defense' },
  { name: 'calm',    increased: 'special-defense',  decreased: 'attack' },
  { name: 'gentle',  increased: 'special-defense',  decreased: 'defense' },
  { name: 'sassy',   increased: 'special-defense',  decreased: 'speed' },
  { name: 'careful', increased: 'special-defense',  decreased: 'special-attack' },
  { name: 'quirky',  increased: null,               decreased: null },
];
