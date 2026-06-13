export type ItemAttribute =
  | 'countable'
  | 'consumable'
  | 'usable-overworld'
  | 'usable-in-battle'
  | 'holdable'
  | 'holdable-passive'
  | 'holdable-active'
  | 'underground';

export type ItemCategory =
  | 'stat-boosts'
  | 'effort-drop'
  | 'medicine'
  | 'other'
  | 'in-a-pinch'
  | 'picky-healing'
  | 'type-protection'
  | 'baked-goods'
  | 'collectibles'
  | 'evolution'
  | 'spelunking'
  | 'held-items'
  | 'choice'
  | 'effort-training'
  | 'bad-held-items'
  | 'training'
  | 'plates'
  | 'species-specific'
  | 'type-enhancement'
  | 'event-items'
  | 'gameplay'
  | 'plot-advancement'
  | 'unused'
  | 'loot'
  | 'mega-stones'
  | 'memories'
  | 'z-crystals'
  | 'mulch'
  | 'miracle-shooter'
  | 'jewels'
  | 'berry-pots'
  | 'vitamins'
  | 'healing'
  | 'pp-recovery'
  | 'revival'
  | 'status-cures'
  | 'mail'
  | 'standard-balls'
  | 'special-balls'
  | 'apricorn-balls'
  | 'apricorn-box'
  | 'data-cards'
  | 'scarves'
  | 'all-mail'
  | 'flutes'
  | 'terashards'
  | 'sandwiches';

export type FlingEffect =
  | 'badly-poison'
  | 'burn'
  | 'berry-effect'
  | 'herb-effect'
  | 'paralyze'
  | 'poison'
  | 'flinch';

export type ItemType = {
  id: number;
  name: string;
  sprite: string | null;
  category: ItemCategory | null;
  fling_power: number | null;
  fling_effect: FlingEffect | null;
  attributes: ItemAttribute[];
  effect: string | null;
  flavor_text: string | null;
};
