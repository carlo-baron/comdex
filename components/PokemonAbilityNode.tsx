"use client";
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import { title } from '@/utils/titleCase';
import { useState, useEffect } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
	CardContent
} from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { type AbilityEntryType } from '@/types/pokemon';

export type PokemonAbilityNodeType = Node<{ urls: string[] }, 'pokemonAbilityNode'>;

export default function PokemonAbilityNode({ selected, data }: NodeProps<PokemonAbilityNodeType>) {
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
			<CardContent>
				{
					abilities.map((ability, index) => {
						return(
							<Collapsible
							key={index}
							className='group'
							>
								<CollapsibleTrigger asChild>
									<Button
										className="nodrag text-xl font-bold w-full"
										onClick={(e) => e.stopPropagation()}
										variant='ghost'
									>
										{title(ability.name)}
										<ChevronDown className='ml-auto transition-transform group-data-[state=open]:rotate-180' />
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent>
          				{ability.effect_entries.find(entry => entry.language.name === 'en')?.short_effect}
								</CollapsibleContent>
							</Collapsible>
						);
					})
				}
			</CardContent>
    </Card>
  );
}
