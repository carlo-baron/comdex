"use client";
import Image from 'next/image';
import { Badge } from './ui/badge';
import { useRef, useMemo, memo, useCallback } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import { Volume2 } from 'lucide-react';
import { Input } from './ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PokemonStatType, PokemonType } from '@/types/pokemon';
import { natures, type NatureName } from '@/data/natures';
import { usePokemonDataStore } from '@/hooks/PokemonDataStore';

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

	// TODO: change to combobox
	const natureOptions = useMemo(() => {
		return natures.map((nature, index) => (
      <SelectItem value={nature.name} key={index}>
        {nature.name[0].toUpperCase() + nature.name.slice(1)}
      </SelectItem>
    ));
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

      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          {data.name}
          {audioElement}
        </CardTitle>

        <span className="flex gap-2 items-center">{typeBadges}</span>

        <span className="flex gap-2 items-center">
          <p>Cry:</p>
          <Volume2 size={16} onClick={handleCryClick} />
        </span>

        <span className="flex gap-2 items-center level">
          <p>Lvl:</p>
          <Input
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

        <span className="flex gap-2 items-center level">
          <p>Nature:</p>
          <Select
            value={nature}
            onValueChange={(val) => updatePokemonData(id, { nature: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a Nature" />
            </SelectTrigger>
            <SelectContent>
							{natureOptions}
            </SelectContent>
          </Select>
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
          <h2 className="font-extrabold"
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
          <h2 className="col-span-2 font-extrabold"
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
