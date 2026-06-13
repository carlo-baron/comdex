"use client";
import { useMemo, memo, useState, useEffect } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { ArrowRight } from 'lucide-react';

export type PokemonEvolutionNodeProps = {
  name: string;
  sprite: string;
};

type ChainType = {
  name: string;
  sprite: string;
};

type EvolutionChainLink = {
  species: { name: string; url: string };
  evolves_to: EvolutionChainLink[];
};

export type PokemonEvolutionNodeType = Node<PokemonEvolutionNodeProps, 'pokemonEvolutionNode'>;

function flattenChain(link: EvolutionChainLink): string[] {
  const names = [link.species.name];
  if (link.evolves_to.length > 0) {
    return [...names, ...flattenChain(link.evolves_to[0])];
  }
  return names;
}

function PokemonEvolutionNode({ selected, data }: NodeProps<PokemonEvolutionNodeType>) {
  const [chain, setChain] = useState<ChainType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getChain() {
      try {
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.name}`);
        const speciesData = await speciesRes.json();

        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionRes.json();

        const names = flattenChain(evolutionData.chain);

        const chainWithSprites = await Promise.all(
          names.map(async (name) => {
            const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const pokemonData = await pokemonRes.json();
            return {
              name,
              sprite: pokemonData.sprites.front_default ?? '',
            };
          })
        );

        setChain(chainWithSprites);
      } catch (err) {
        console.error('Failed to fetch evolution chain:', err);
      } finally {
        setLoading(false);
      }
    }
    getChain();
  }, [data.name]);

  const chainMap = useMemo(() => {
    if (loading) return <p>Loading...</p>;
    if (chain.length <= 1) return <p className="text-center w-full text-muted-foreground">No evolution.</p>;
    return chain.map((item, index) => (
      <div key={index} className='flex items-center gap-2'>
        <div className="flex flex-col gap-2 items-center">
          <img className="aspect-square w-16" src={item.sprite} alt={item.name} />
          <p className="text-sm capitalize">{item.name}</p>
        </div>
        {index !== chain.length - 1 && <ArrowRight size={16} />}
      </div>
    ));
  }, [chain, loading]);

  return (
    <Card className={`w-80 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <CardHeader className='text-center'>
        <CardTitle className="text-xl font-bold text-center">
          Evolution
        </CardTitle>
        <CardDescription>
          See pokemon&apos;s evolution line.
        </CardDescription>
      </CardHeader>
      <CardContent className='nodrag nowheel'>
        <div className="nodrag cursor-pointer text-center flex gap-2 items-center flex-wrap w-full justify-center">
          {chainMap}
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(PokemonEvolutionNode);
