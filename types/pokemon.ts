//main
export type PokemonType = {
  id: number;
  name: string;
  height: number;
  weight: number;
	cries: {
		latest: string,
		legacy: string,
	}
  sprites: {
    front_default: string;
  };
  stats: PokemonStatType[];
	abilities: PokemonAbilityType[];
	types: PokemonTypeType[]
};

type PokemonTypeType = {
	type: {
		name: string,
	}
}

export type PokemonSearchList = {
	id: number;
	name: string;
	sprite: string | null;
	types: string[]
}

export type AbilityEntryType = {
  id: number;
  name: string;
  effect_entries: EffectEntryType[];
};

//minor
type EffectEntryType = {
	short_effect: string;
  language: {
    name: string;
  };
};

export type PokemonStatType = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
  };
};

export type PokemonAbilityType = {
	ability: {
		name: string;
		url: string;
	};
	isHidden: boolean;
	slot: number
}
