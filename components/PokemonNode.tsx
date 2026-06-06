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
import { type PokemonType } from '@/types/pokemon';
import { natures } from '@/data/natures';

const NatureOptions = memo(() => (
  <>
    {natures.map((nature, index) => (
      <SelectItem value={nature.name} key={index}>
        {nature.name[0].toUpperCase() + nature.name.slice(1)}
      </SelectItem>
    ))}
  </>
));
NatureOptions.displayName = 'NatureOptions';

type PokemonNodeProps = {
  onExpandAbility: (id: string, url: string) => void;
} & PokemonType;

export type PokemonNodeType = Node<PokemonNodeProps, 'pokemonNode'>;

const PokemonNode = memo(function PokemonNode({
  id,
  selected,
  data,
}: NodeProps<PokemonNodeType>) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <Card className={`w-54 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Left} />
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
            defaultValue={100}
            onKeyDown={(e) => e.stopPropagation()}
            min={1}
            max={100}
          />
        </span>

        <span className="flex gap-2 items-center level">
          <p>Nature:</p>
          <Select
					defaultValue='sassy'
					>
            <SelectTrigger>
              <SelectValue placeholder="Choose a Nature" />
            </SelectTrigger>
            <SelectContent>
              <NatureOptions />
            </SelectContent>
          </Select>
        </span>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 text-center">
          <h2 className="font-extrabold">Stats</h2>
          <h2 className="font-extrabold">Abilities</h2>
          <h2 className="font-extrabold">Moves</h2>
          <h2 className="font-extrabold">Items</h2>
          <h2 className="col-span-2 font-extrabold">Evolution</h2>
        </div>
      </CardContent>

      <Handle type="source" position={Position.Right} />
    </Card>
  );
});

export default PokemonNode;
