"use client";
import { useState, useEffect } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export type AbilityEntryType = {
  id: number;
  name: string;
  effect_entries: EffectEntryType[];
};

type EffectEntryType = {
	short_effect: string;
  language: {
    name: string;
  };
};

export type PokemonAbilityNodeType = Node<{ url: string }, 'pokemonAbilityNode'>;

export default function PokemonAbilityNode({ data }: NodeProps<PokemonAbilityNodeType>) {
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
