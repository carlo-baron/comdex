"use client";
import { memo, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import { title } from '@/utils/titleCase';
import { Separator } from './ui/separator';
import { useState, useEffect } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
	CardContent
} from "./ui/card";
import { type AbilityEntryType } from '@/types/pokemon';

export type PokemonAbilityNodeType = Node<{ urls: string[] }, 'pokemonAbilityNode'>;

function PokemonAbilityNode({ selected, data }: NodeProps<PokemonAbilityNodeType>) {
	const [selectedAbility, setSelectedAbility] = useState<AbilityEntryType | null>(null);
  const [abilities, setAbilities] = useState<AbilityEntryType[]>([]);

  useEffect(() => {
    async function fetchAbility() {
			const results: AbilityEntryType[] = [];
			for(const url of data.urls){
				const res = await fetch(url);
				const resData = await res.json();
				results.push(resData)
			}
      setAbilities(results);
    }

    fetchAbility();
  }, [data.urls]);

 	if (!abilities) return <Card className="p-4 w-48">Loading...</Card>;

	const abilityMap = useMemo(() => {
		return abilities.map((ability, index) => {
			return(
				<Card
				key={index}
				className='mb-2 cursor-pointer p-0'
				onClick={() => setSelectedAbility(ability)}
				>
					<CardContent className='flex flex-col gap-2 px-4 py-2'>
						<p className='font-bold text-md text-center'>{title(ability.name)}</p>
						<p className='text-center'>
							{ability.effect_entries.find(entry => entry.language.name === 'en')?.short_effect}
						</p>
					</CardContent>
				</Card>
			);
		})
	}, [abilities]);

  return (
		<Card className={`w-80 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <CardHeader className='text-center'>
        <CardTitle className="text-xl font-bold text-center">
         	Abilities
        </CardTitle>
        <CardDescription>
					Learn all possible abilities for this pokemon
        </CardDescription>
      </CardHeader>
			<CardContent className='nodrag nowheel cursor-pointer'>
				<Card className="p-0 mb-2">
					<CardContent className="px-4 py-2">
						{selectedAbility === null ? 
							(
								<span className='w-full flex justify-center'><Plus /></span>
							) 
								: 
							(
								<div className="flex flex-col gap-2 relative">
									<X 
									className='absolute right-0 top-0'
									onClick={() => setSelectedAbility(null)}
									/>
									<span className='flex gap-2 items-center justify-center'>
										<p className="font-bold text-lg">
											{title(selectedAbility.name)}
										</p>
									</span>
									<p className='text-center w-full'>{selectedAbility.effect_entries.find(entry => entry.language.name === 'en')?.short_effect}</p>
								</div>
							)
						}
					</CardContent>
				</Card>
				<Separator className='my-4 '/>
				{abilityMap}
			</CardContent>
    </Card>
  );
}

export default memo(PokemonAbilityNode);
