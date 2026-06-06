"use client";
import { 
	useRef,
} from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import { Volume2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { 
	PokemonType,
} from '@/types/pokemon';

type PokemonNodeProps = {
	onExpandAbility: (id: string, url: string) => void;
} & PokemonType

export type PokemonNodeType = Node<PokemonNodeProps, 'pokemonNode'>;

export default function PokemonNode({ id, data }: NodeProps<PokemonNodeType>) {
	const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <Card>
      <Handle type="target" position={Position.Left} />
      <img
        src={data.sprites.front_default}
        alt="Pokemon Sprite"
        className="w-40 aspect-square"
      />
      <CardHeader>
        <CardTitle
				className='flex gap-2 items-center'
				>
				{data.name}
				<audio src={data.cries.latest} preload='auto' />
				<Volume2 
				size={16}
				onClick={() =>
					{
						audioRef.current?.play();
					}
				} />
				</CardTitle>
      </CardHeader>
      <CardContent>
				<div className="stats">
					<h2 className="font-extrabold text-center w-full">Stats</h2>
					<ol>
						{data.stats.map((stat, index) => (
							<li 
							key={index}
							className="flex gap-4"
							>
								<p>{stat.stat.name}</p>
								<p className='font-bold'>{stat.base_stat}</p>
							</li>
						))}
					</ol>
				</div>
				<div className="abilities">
					<h2 className="font-extrabold text-center w-full">Abilities</h2>
					<ol>
						{data.abilities.map((ability, index) => (
							<li 
							key={index}
							className="flex gap-4"
							onClick={() => data.onExpandAbility(id, ability.ability.url)}
							>
								<p>{ability.slot}</p>
								<p className='font-bold'>{ability.ability.name}</p>
							</li>
						))}
					</ol>
				</div>
      </CardContent>
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
