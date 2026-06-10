"use client";

import { memo, useMemo, useCallback } from 'react';
import { Switch } from "@/components/ui/switch"
import { useState } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
	CardContent
} from "./ui/card";
import StatRadarChart from './StatRadarChart';
import { PokemonStatType } from '@/types/pokemon';
import { NatureName } from '@/data/natures';
import { natures } from '@/data/natures';
import { StatSliderItem } from './StatSliderItem';
import { EvIvSliderItem } from './EvIvSlider';

export type PokemonStatProps = {
	stats: PokemonStatType[],
	level: number;
	nature: NatureName;
}

export type PokemonStatNodeType = Node<PokemonStatProps, 'pokemonStatNode'>;

function PokemonStatNode({ id, selected, data }: NodeProps<PokemonStatNodeType>) {
	const [isAffected, setIsAffected] = useState(false);
	const [evs, setEvs] = useState<Record<string, number>>({
	hp: 0, attack: 0, defense: 0,
		'special-attack': 0, 'special-defense': 0, speed: 0
	});
	const [ivs, setIvs] = useState<Record<string, number>>({
		hp: 0, attack: 0, defense: 0,
		'special-attack': 0, 'special-defense': 0, speed: 0
	});

	const totalEvs = useMemo(() => 
		Object.values(evs).reduce((a, b) => a + b, 0), 
	[evs]);

	const setEv = useCallback((statName: string, value: number) => {
		const otherTotal = totalEvs - (evs[statName] ?? 0);
		const capped = Math.min(value, 252, 510 - otherTotal);
		setEvs(prev => ({ ...prev, [statName]: capped }));
	}, [evs, totalEvs]);

	const setIv = useCallback((statName: string, value: number) => {
		const capped = Math.min(31, Math.max(0, value))
		setIvs(prev => ({ ...prev, [statName]: capped }));
	}, [])

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
					Math.floor(((2 * stat.base_stat + ivs[stat.stat.name] + Math.floor(evs[stat.stat.name] / 4)) * data.level) / 100) + 5
				);

				const statVal = stat.stat.name === 'hp'
					? Math.floor(((2 * stat.base_stat + ivs[stat.stat.name] + Math.floor(evs[stat.stat.name] / 4)) * data.level) / 100) + data.level + 10
					: Math.floor(statValNum * natureMult);

				const natureChange: 'increase' | 'decrease' | null = 
					isAffected &&
					natureObj?.increased === statName ? "increase" : 
					isAffected &&
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

	}, [data.level, data.nature,evs, ivs, data.stats, isAffected]);

	const bst = useMemo(() => {
		return calculatedStats.reduce((acc, item) => {
			return acc + item.stat.value;
		}, 0);
	}, [calculatedStats]);

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

	const evIvSliders = useMemo(() => {
		return calculatedStats.map((statItem, index) => (
			<EvIvSliderItem
			key={index}
			name={statItem.stat.name}
			ev={evs[statItem.stat.name]}
			iv={ivs[statItem.stat.name]}
			onEvChange={setEv}
			onIvChange={setIv}
			/>
		))
	}, [calculatedStats, evs, setEv, ivs, setIv]);

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
			<CardContent
			className='flex flex-col gap-2'
			>
				<StatRadarChart
				stats={radarData}
				/>
				<span className="flex gap-2">
					<p>Apply Level & Nature</p>
					<Switch onCheckedChange={() => setIsAffected(prev => !prev)}/>
				</span>
				<section className="cursor-default nodrag sliders">
					{statSliders}
					<span className="flex gap-2">
						<p>Total</p>			
						<p className='font-bold'>{bst}</p>
						<span className="flex gap-1 ml-auto">
							<p className="text-muted-foreground">Min</p>
							<p className="text-muted-foreground">Max</p>
						</span>
					</span>
				</section>
				<section className="nodrag cursor-default ev-iv">
					{evIvSliders}
				</section>
			</CardContent>
    </Card>
  );
}

export default memo(PokemonStatNode);
