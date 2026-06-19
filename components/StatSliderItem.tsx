"use client";

import { memo } from 'react';
import { title } from '@/utils/titleCase';
import { Slider } from './ui/slider';
import { abbreviateStat } from '@/utils/abbreviateStat';

interface StatSliderItemProps{
	stat: {
		name: string;
		value: number;
		min: number;
		max: number;
	};
	natureChange: 'increase' | 'decrease' | null
}

export const StatSliderItem = memo(function StatSliderItem(
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
