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

interface StatSliderItemProps{
	stat: {
		name: string;
		value: number;
		min: number;
		max: number;
	};
	natureChange: 'increase' | 'decrease' | null
}

export default function PokemonStatNode({ id, selected, data }: NodeProps<PokemonStatNodeType>) {
	const [isAffected, setIsAffected] = useState(false);
	const [ev, setEv] = useState(0);
	const [iv, setIv] = useState(0);

	const calculatedStats = useMemo(() => {

		const statMap = data.stats.map((stat) => {
			const minVal = Math.floor(
				Math.floor(((2 * stat.base_stat + 0 + 0) * 100) / 100) + 5
			);

			const min = stat.stat.name === 'hp'
				? Math.floor(((2 * stat.base_stat + 0 + 0) * 100) / 100) + 100 + 10
				: Math.floor(minVal * 0.9);

			const maxVal = Math.floor(
				Math.floor(((2 * stat.base_stat + 31 + Math.floor(252 / 4)) * 100) / 100) + 5
			);

			const max = stat.stat.name === 'hp'
				? Math.floor(((2 * stat.base_stat + 31 + Math.floor(252 / 4)) * 100) / 100) + 100 + 10
				: Math.floor(maxVal * 1.1);

				const natureObj = natures.find(n => n.name === data.nature);
				const statName = stat.stat.name;

				const natureMult = 
					natureObj?.increased === statName ? 1.1 : 
					natureObj?.decreased === statName ? 0.9 : 
					1;

				const statValNum = Math.floor(
					Math.floor(((2 * stat.base_stat + iv + Math.floor(ev / 4)) * data.level) / 100) + 5
				);

				const statVal = stat.stat.name === 'hp'
					? Math.floor(((2 * stat.base_stat + iv + Math.floor(ev / 4)) * data.level) / 100) + data.level + 10
					: Math.floor(statValNum * natureMult);

				const natureChange: 'increase' | 'decrease' | null = 
					natureObj?.increased === statName ? "increase" : 
					natureObj?.decreased === statName ? "decrease" : 
					null;

				return {
					stat: {
						name: stat.stat.name,
						value: isAffected ? statVal : stat.base_stat,
						min,
						max,
					},
					natureChange: natureChange
				};
		});

		return statMap;

	}, [data.level, data.nature, ev, iv, data.stats, isAffected]);

	const radarData = useMemo(() => {
		return calculatedStats.map(stat => {
			return {
				name: stat.stat.name,
				value: stat.stat.value
			};
		});
	}, [calculatedStats]);

	const statSliders = useMemo(() => 
		calculatedStats.map((statItem, index) => (
			<StatSliderItem 
			key={index}
			stat={statItem.stat}
			natureChange={statItem.natureChange}
			/>
		)),
	[calculatedStats]);

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
				<StatRadarChart
				stats={radarData}
				/>
				<span className="mt-4 flex gap-2">
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
		natureChange
	}
	:
	StatSliderItemProps
){
	return(
		<span className="flex flex-col">
			<span className={`flex gap-2 ${natureChange === 'increase' ? 'text-red-500' : natureChange === 'decrease' ? 'text-blue-500' : '' }`}>
				<p>{title(abbreviateStat(stat.name))}</p>			
				<p className='font-bold'>{stat.value}</p>
			</span>
			<span className="flex gap-2">
				<Slider 
					className='flex-2 col-span-2 [&_[role=slider]]:hidden pointer-events-none'
					value={[stat.value]}
					max={stat.max}
				/>
				<p className="min-max text-nowrap">{stat.min}-{stat.max}</p>
			</span>
		</span>
	);
});
