"use client";
import Image from 'next/image';
import { Badge } from './ui/badge';
import { useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import { Volume2 } from 'lucide-react';
import { Input } from './ui/input';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { PokemonStatType, PokemonType } from '@/types/pokemon';
import { natures, type NatureName, type PokemonNatureType } from '@/data/natures';
import { usePokemonDataStore } from '@/hooks/PokemonDataStore';
import { abbreviateStat } from '@/utils/abbreviateStat';

type PokemonNodeProps = {
  onExpandAbility: (id: string, urls: string[]) => void;
  onExpandStats: (id: string, stats: PokemonStatType[], level: number, nature: NatureName) => void;
  onExpandMoves: (id: string, movePool: string[]) => void;
  onExpandItems: (id: string) => void;
  onExpandEvolution: (id: string, name: string, sprite: string) => void;
} & PokemonType;

export type PokemonNodeType = Node<PokemonNodeProps, 'pokemonNode'>;

const PokemonNode = memo(function PokemonNode({
  id,
  selected,
  data,
}: NodeProps<PokemonNodeType>) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pokemonData = usePokemonDataStore(state => state.pokemon[id]);
  const updatePokemonData = usePokemonDataStore(state => state.updatePokemon);

  const nature = useMemo(() => pokemonData?.nature ?? 'sassy', [pokemonData]);
  const level = useMemo(() => pokemonData?.level ?? 100, [pokemonData]);

	useEffect(() => {
		const current = usePokemonDataStore.getState().pokemon[id];
		if (current && !current.sprite) {
			updatePokemonData(id, {
				sprite: data.sprites.front_default,
				types: data.types,
			});
		}
	}, [id, data.sprites.front_default, data.types, updatePokemonData]);

  const handleCryClick = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const audioElement = useMemo(
    () => <audio ref={audioRef} src={data.cries.latest} preload="auto" />,
    [data.cries.latest]
  );

  const typeBadges = useMemo(
    () =>
      data.types.map((type, index) => (
        <Badge variant="outline" key={index}>
          {type.type.name}
        </Badge>
      )),
    [data.types]
  );

  const getNatureLabel = useCallback((nature: PokemonNatureType) => {
    const plus = nature.increased ? `${abbreviateStat(nature.increased)}+` : "";
    const minus = nature.decreased ? `${abbreviateStat(nature.decreased)}-` : "";
    const guide = plus && minus ? ` (${plus} ${minus})` : "";
    return nature.name[0].toUpperCase() + nature.name.slice(1) + guide;
  }, []);

  return (
    <Card className={`w-54 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex justify-center w-full">
        <Image
          src={data.sprites.front_default}
          width={100}
          height={100}
          alt="Pokemon Sprite"
        />
      </div>

      <CardHeader className='p-2'>
        <CardTitle className="flex gap-2 items-center">
          {data.name}
          {audioElement}
        </CardTitle>

        <span className="flex gap-2 items-center">{typeBadges}</span>

        <span className="nodrag cursor-pointer flex gap-2 items-center">
          <p>Cry:</p>
          <Volume2 size={16} onClick={handleCryClick} />
        </span>

        <span className="flex gap-2 items-center level">
          <p>Lvl:</p>
          <Input
            className='max-w-15'
            type="number"
            value={level}
            onChange={(e) => {
              const val = Math.min(100, Math.max(1, Number(e.target.value)));
              updatePokemonData(id, { level: val });
            }}
            onKeyDown={(e) => e.stopPropagation()}
            min={1}
            max={100}
          />
        </span>

        <span className="nodrag flex gap-2 items-center level">
          <p>Nature:</p>
					<Combobox
						items={natures.map(n => n.name)}
						value={nature}
						onValueChange={(val) => updatePokemonData(id, { nature: val ?? 'sassy' })}
					>
						<ComboboxInput placeholder="Select a nature" />
						<ComboboxContent>
							<ComboboxEmpty>No items found.</ComboboxEmpty>
							<ComboboxList>
								{(name) => {
									const n = natures.find(nat => nat.name === name)!;
									return (
										<ComboboxItem value={name} key={name}>
											{getNatureLabel(n)}
										</ComboboxItem>
									);
								}}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
        </span>
      </CardHeader>

      <CardContent>
        <div className="cursor-pointer nodrag grid grid-cols-2 text-center">
          <h2
            className="font-extrabold"
            onClick={() => data.onExpandStats(id, data.stats, level, nature)}
          >
            Stats
            <Handle
              position={Position.Left}
              type='source'
              style={{ top: 298 }}
              id={`${id}-stats`}
            />
          </h2>
          <h2
            className="font-extrabold"
            onClick={() => data.onExpandAbility(id, data.abilities.map(ability => ability.ability.url))}
          >
            Abilities
            <Handle
              position={Position.Right}
              type='source'
              style={{ top: 298 }}
              id={`${id}-abilities`}
            />
          </h2>
          <h2
            className="font-extrabold"
            onClick={() => data.onExpandMoves(id, data.moves.map(move => move.move.name))}
          >
            Moves
            <Handle
              position={Position.Left}
              type='source'
              style={{ top: 298 + 20 }}
              id={`${id}-moves`}
            />
          </h2>
          <h2
            className="font-extrabold"
            onClick={() => data.onExpandItems(id)}
          >
            Items
            <Handle
              position={Position.Right}
              type='source'
              style={{ top: 298 + 20 }}
              id={`${id}-items`}
            />
          </h2>
          <h2
            className="col-span-2 font-extrabold"
            onClick={() => data.onExpandEvolution(id, data.name, data.sprites.front_default)}
          >
            Evolution
            <Handle
              position={Position.Bottom}
              type='source'
              id={`${id}-evolution`}
            />
          </h2>
        </div>
      </CardContent>
    </Card>
  );
});

export default PokemonNode;
