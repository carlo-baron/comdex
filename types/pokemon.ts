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
