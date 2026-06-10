"use client";

import { Input } from './ui/input';
import { memo } from 'react';
import { Slider } from './ui/slider';

export const EvIvSliderItem = memo(function EvIvSliderItem(
	{ 
		name,
		ev,
		iv,
		onEvChange,
		onIvChange
	}
	:
	{ 
		name: string;
		ev: number;
		iv: number;
		onEvChange: (name: string, value: number) => void;
		onIvChange: (name: string, value: number) => void;
	}
){
	return(
		<div>
			<p>{name}</p>
			<span className="flex gap-2">
				<Input 
				className='w-20'
				value={ev}
				onChange={(e) => {
					const val = Math.min(252, Math.max(0, Number(e.target.value)));
					onEvChange(name, val);
				}}
				type='number' min={0} max={252} />
				<Slider 
				value={[ev]}
				onValueChange={(val) => onEvChange(name, val[0])}
				min={0}
				max={252}
				/>
				<Input 
				value={iv}
				onChange={(e) => {
					const val = Math.min(252, Math.max(0, Number(e.target.value)));
					onIvChange(name, val);
				}}
				className='w-20'
				type='number' min={0} max={31} />
			</span>
		</div>
	);
});

