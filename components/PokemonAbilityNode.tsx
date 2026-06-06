"use client";
import { useState, useEffect } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { type AbilityEntryType } from '@/types/pokemon';

export type PokemonAbilityNodeType = Node<{ url: string }, 'pokemonAbilityNode'>;

export default function PokemonAbilityNode({ selected, data }: NodeProps<PokemonAbilityNodeType>) {
  const [ability, setAbility] = useState<AbilityEntryType | null>(null);

  useEffect(() => {
    async function fetchAbility() {
      const res = await fetch(data.url);
      const resData = await res.json();
      setAbility(resData);
    }

    fetchAbility();
  }, [data.url]);

 	if (!ability) return <Card className="p-4 w-48">Loading...</Card>;

  return (
    <Card
		className={selected ? `ring-2 ring-primary` : ''}
		>
      <Handle type="target" position={Position.Left} />
      <CardHeader
			className='min-w-80'
			>
        <CardTitle className="text-xl font-bold text-center">
          {ability.name}
        </CardTitle>
        <CardDescription>
          {ability.effect_entries.find(entry => entry.language.name === 'en')?.short_effect}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
