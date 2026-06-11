export type DamageClass = 'physical' | 'special' | 'status';

export type MoveAilment =
  | 'burn' | 'paralysis' | 'poison' | 'bad-poison'
  | 'freeze' | 'sleep' | 'confusion' | 'infatuation'
  | 'trap' | 'nightmare' | 'torment' | 'disable'
  | 'yawn' | 'heal-block' | 'no-type-immunity' | 'leech-seed'
  | 'embargo' | 'perish-song' | 'ingrain' | 'silence' | 'none';

export type MoveCategory =
  | 'damage' | 'ailment' | 'net-good-stats' | 'heal'
  | 'damage+ailment' | 'swagger' | 'damage+lower'
  | 'damage+raise' | 'damage+heal' | 'ohko'
  | 'whole-field-effect' | 'field-effect' | 'force-switch'
  | 'unique';

export type MoveTarget =
  | 'specific-move' | 'selected-pokemon-me-first' | 'ally'
  | 'users-field' | 'user-or-ally' | 'opponents-field'
  | 'user' | 'random-opponent' | 'all-other-pokemon'
  | 'selected-pokemon' | 'all-opponents' | 'entire-field'
  | 'user-and-allies' | 'all-pokemon' | 'all-allies'
  | 'fainting-pokemon';

export type MoveMeta = {
  ailment: MoveAilment | null;
  category: MoveCategory | null;
  min_hits: number | null;
  max_hits: number | null;
  drain: number;
  healing: number;
  crit_rate: number;
  stat_chance: number;
};

export type MoveType = {
  id: number;
  name: string;
  type: string;
  pp: number;
  power: number | null;
  accuracy: number | null;
  priority: number;
  damage_class: DamageClass;
  effect_chance: number | null;
  effect: string | null;
  flavor_text: string | null;
  target: MoveTarget;
  meta: MoveMeta;
};
