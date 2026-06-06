"use client";
import { Badge } from './ui/badge';
import { 
	useRef,
} from 'react';
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
	type PokemonType,
} from '@/types/pokemon';
import { natures } from '@/data/natures';

type PokemonNodeProps = {
	onExpandAbility: (id: string, url: string) => void;
} & PokemonType

export type PokemonNodeType = Node<PokemonNodeProps, 'pokemonNode'>;

export default function PokemonNode({ id, selected, data }: NodeProps<PokemonNodeType>) {
	const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <Card
		className={`w-48 ${selected ? `ring-2 ring-primary` : ''}`}
		>
      <Handle type="target" position={Position.Left} />
      <img
        src={data.sprites.front_default}
        alt="Pokemon Sprite"
				className="aspect-square"
      />
      <CardHeader>
        <CardTitle
				className='flex gap-2 items-center'
				>
				{data.name}
				<audio src={data.cries.latest} preload='auto' />
				</CardTitle>
				<span className="flex gap-2 items-center">
					{
						// types can expand too, they will show strenght weakness and resistance
						data.types.map(( type, index ) => {
							console.log(data);
							return(
								<Badge
								variant='outline'
								key={index}
								>
									{type.type.name}
								</Badge>
							);
						})
					}
				</span>
				<span className="flex gap-2 items-center">
					<p>Cry:</p>
					<Volume2 
					size={16}
					onClick={() =>
						{
							audioRef.current?.play();
						}
					} />
				</span>
				<span className="flex gap-2 items-center level">
					<p>Lvl:</p>
					<Input 
					type='number'
					defaultValue={100}
					onKeyDown={(e) => e.stopPropagation()}
					min={1}
					max={100}
					/>
				</span>
				<Select>
					<SelectTrigger>
						<SelectValue placeholder='Choose a Nature'/>
					</SelectTrigger>
					<SelectContent>
					</SelectContent>
				</Select>
      </CardHeader>
      <CardContent>
			{/* expandables */}
			<div className="grid grid-cols-2 text-center">
				<h2 className="font-extrabold">Stats</h2>
				<h2 className="font-extrabold">Abilities</h2>
				<h2 className="font-extrabold">Moves</h2>
				<h2 className="font-extrabold">Items</h2>
				<h2 className="col-span-2 font-extrabold">Evolution</h2>
			</div>
			{/* 
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
			*/}
      </CardContent>
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
