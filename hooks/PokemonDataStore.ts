import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NatureName } from '@/data/natures';
import { MoveType } from '@/types/moves';
import { ItemType } from '@/types/items';
import { AbilityEntryType } from '@/types/pokemon';

export type PokemonData = {
  level: number;
  nature: NatureName;
  evs: Record<string, number>;
  ivs: Record<string, number>;
  selectedMoves: (MoveType | null)[];
  selectedItem: ItemType | null;
  selectedAbility: AbilityEntryType | null;
};

const defaultPokemonData = (): PokemonData => ({
  level: 50,
  nature: 'hardy',
  evs: {
    hp: 0,
    attack: 0,
    defense: 0,
    'special-attack': 0,
    'special-defense': 0,
    speed: 0,
  },
  ivs: {
    hp: 31,
    attack: 31,
    defense: 31,
    'special-attack': 31,
    'special-defense': 31,
    speed: 31,
  },
  selectedMoves: [null, null, null, null],
  selectedItem: null,
  selectedAbility: null,
});

type PokemonDataStore = {
  pokemon: Record<string, PokemonData>;
  initPokemon: (id: string) => void;
  updatePokemon: (id: string, data: Partial<PokemonData>) => void;
  removePokemon: (id: string) => void;
  clear: () => void;
};

export const usePokemonDataStore = create<PokemonDataStore>()(
  persist(
    (set) => ({
      pokemon: {},

      initPokemon: (id) => {
        set(state => {
          if (state.pokemon[id]) return state;
          return {
            pokemon: {
              ...state.pokemon,
              [id]: defaultPokemonData(),
            },
          };
        });
      },

      updatePokemon: (id, data) => {
        set(state => ({
          pokemon: {
            ...state.pokemon,
            [id]: {
              ...state.pokemon[id],
              ...data,
            },
          },
        }));
      },

      removePokemon: (id) => {
        set(state => {
          const next = { ...state.pokemon };
          delete next[id];
          return { pokemon: next };
        });
      },

      clear: () => {
        set({ pokemon: {} });
      },
    }),
    {
      name: 'comdex-pokemon-data',
    }
  )
);
