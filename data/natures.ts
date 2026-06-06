export type Stats = 'hp' | 'attack' | 'defense' | 'spatk' | 'spdef' | 'speed';

export type Nature = {
  name: string;
  increased: Stats | null;
  decreased: Stats | null;
};

export const natures: Nature[] = [
  { name: 'hardy',   increased: null,      decreased: null },
  { name: 'lonely',  increased: 'attack',  decreased: 'defense' },
  { name: 'brave',   increased: 'attack',  decreased: 'speed' },
  { name: 'adamant', increased: 'attack',  decreased: 'spatk' },
  { name: 'naughty', increased: 'attack',  decreased: 'spdef' },
  { name: 'bold',    increased: 'defense', decreased: 'attack' },
  { name: 'docile',  increased: null,      decreased: null },
  { name: 'relaxed', increased: 'defense', decreased: 'speed' },
  { name: 'impish',  increased: 'defense', decreased: 'spatk' },
  { name: 'lax',     increased: 'defense', decreased: 'spdef' },
  { name: 'timid',   increased: 'speed',   decreased: 'attack' },
  { name: 'hasty',   increased: 'speed',   decreased: 'defense' },
  { name: 'serious', increased: null,      decreased: null },
  { name: 'jolly',   increased: 'speed',   decreased: 'spatk' },
  { name: 'naive',   increased: 'speed',   decreased: 'spdef' },
  { name: 'modest',  increased: 'spatk',   decreased: 'attack' },
  { name: 'mild',    increased: 'spatk',   decreased: 'defense' },
  { name: 'quiet',   increased: 'spatk',   decreased: 'speed' },
  { name: 'bashful', increased: null,      decreased: null },
  { name: 'rash',    increased: 'spatk',   decreased: 'spdef' },
  { name: 'calm',    increased: 'spdef',   decreased: 'attack' },
  { name: 'gentle',  increased: 'spdef',   decreased: 'defense' },
  { name: 'sassy',   increased: 'spdef',   decreased: 'speed' },
  { name: 'careful', increased: 'spdef',   decreased: 'spatk' },
  { name: 'quirky',  increased: null,      decreased: null },
];
