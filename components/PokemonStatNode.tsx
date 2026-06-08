"use client";
import { memo, useMemo } from 'react';
import { title } from '@/utils/titleCase';
import { Switch } from "@/components/ui/switch"
import { Slider } from './ui/slider';
import { useState } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
	CardContent
} from "./ui/card";
import StatRadarChart, { abbreviateStat } from './StatRadarChart';
import { PokemonStatType } from '@/types/pokemon';
import { NatureName } from '@/data/natures';
import { natures } from '@/data/natures';

export type PokemonStatProps = {
	stats: PokemonStatType[],
	level: number;
	nature: NatureName
}

export type PokemonStatNodeType = Node<PokemonStatProps, 'pokemonStatNode'>;

export default function PokemonStatNode({ id, selected, data }: NodeProps<PokemonStatNodeType>) {
	const [isAffected, setIsAffected] = useState(false);

	const bst = useMemo(() => {
		return data.stats.reduce((acc, val) => {
			return acc + val.base_stat
		}, 0)
	}, [data.stats]);
	const statSliders = useMemo(() => 
		data.stats.map((statItem, index) => (
			<StatSliderItem 
			key={index}
			stat={statItem}
			level={data.level}
			nature={data.nature}
			isAffected={isAffected}
			/>
		)),
	[data.stats, isAffected, data.nature, data.level]);

  return (
		<Card className={`w-80 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Right} />
      <CardHeader className='text-center'>
        <CardTitle className="text-xl font-bold text-center">
         	Stats	
        </CardTitle>
        <CardDescription>
					See pokemon stats with adjustments due to level and nature.
        </CardDescription>
      </CardHeader>
			<CardContent>
				<span className="flex gap-2 top">
					<StatRadarChart
					stats={data.stats}
					/>
					<div className='flex-1 flex flex-col items-center justify-center'>
						<p className="font-medium">BST</p>
						<p className='font-bold text-2xl'>{bst}</p>
					</div>
				</span>
				<span className="flex gap-2">
					<p>Apply Level & Nature</p>
					<Switch onCheckedChange={() => setIsAffected(prev => !prev)}/>
				</span>
				<section className="cursor-default nodrag sliders">
				{statSliders}
				</section>
			</CardContent>
    </Card>
  );
}

const StatSliderItem = memo(function StatSliderItem(
	{
		stat,
		level = 100,
		iv = 0,
		ev = 0,
		nature,
		isAffected = false
	}
	:
	{
		stat: PokemonStatType;
		level: number;
		iv: number;
		ev: number;
		nature: NatureName;
		isAffected: boolean;
	}
){

	const min = useMemo(() => {
		const value = Math.floor(
			Math.floor(((2 * stat.base_stat + 0 + 0) * 100) / 100) + 5
		);
		return stat.stat.name === 'hp'
			? Math.floor(((2 * stat.base_stat + 0 + 0) * 100) / 100) + 100 + 10
			: Math.floor(value * 0.9);
	}, [stat]);

	const max = useMemo(() => {
		const value = Math.floor(
			Math.floor(((2 * stat.base_stat + 31 + Math.floor(252 / 4)) * 100) / 100) + 5
		);
		return stat.stat.name === 'hp'
			? Math.floor(((2 * stat.base_stat + 31 + Math.floor(252 / 4)) * 100) / 100) + 100 + 10
			: Math.floor(value * 1.1);
	}, [stat]);

	const statVal = useMemo(() => {
		if(!isAffected) return stat.base_stat;

		const natureObj = natures.find(n => n.name === nature);
		const statName = stat.stat.name;

		const natureMult = 
			natureObj?.increased === statName ? 1.1 : 
			natureObj?.decreased === statName ? 0.9 : 
			1;

		const value = Math.floor(
			Math.floor(((2 * stat.base_stat + iv + Math.floor(ev / 4)) * level) / 100) + 5
		);
		return stat.stat.name === 'hp'
			? Math.floor(((2 * stat.base_stat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10
			: Math.floor(value * natureMult);
	}, [stat, level, nature, isAffected, ev, iv])

	return(
		<span className="flex flex-col">
			<span className="flex gap-2">
				<p>{title(abbreviateStat(stat.stat.name))}</p>			
				<p className='font-bold'>{statVal}</p>
			</span>
			<span className="flex gap-2">
				<Slider 
					className='flex-2 col-span-2 [&_[role=slider]]:hidden pointer-events-none'
					defaultValue={[stat.base_stat]}
				/>
				<p className="min-max text-nowrap flex-1">{min}-{max}</p>
			</span>
		</span>
	);
});
