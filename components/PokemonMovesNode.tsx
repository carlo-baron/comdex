"use client";
import { 
	useState,
	useRef,
	useMemo,
	memo
} from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
	CardContent
} from "./ui/card";
import { Input } from './ui/input';
import moves from "@/data/moves.json";

export type PokemonMovesNodeProps = {
	movePool: string[]
}

export type PokemonMovesNodeType = Node<PokemonMovesNodeProps, 'pokemonMovesNode'>;

export default function PokemonMovesNode({ selected, data }: NodeProps<PokemonMovesNodeType>) {
	const [query, setQuery] = useState('');
	const [limit, setLimit] = useState(20);
	const [learnableMoves] = useState(() => moves.filter(move => data.movePool.includes(move.name)));
	const viewportRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const el = viewportRef.current
    if (!el) return

    const isBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10

    if (isBottom) {
			if(learnableMoves.filter(move => move.name.includes(query.toLowerCase())).length > 20){
      	setLimit(prev => prev + 20);
			}
    }
  }

  return (
		<Card className={`w-80 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Right} />
      <CardHeader className='text-center'>
        <CardTitle className="text-xl font-bold text-center">
         	Moves	
        </CardTitle>
        <CardDescription>
					Choose 4 moves, and see the pokemon&apos;s move pool.	
        </CardDescription>
      </CardHeader>
			<CardContent
			className='nodrag nowheel cursor-pointer'
			>
				<Input 
				onChange={(e) => setQuery(e.target.value)}
				type='text'
				placeholder='Search for a move...'
				/>
				<div 
				className='h-72 overflow-y-auto'
				ref={viewportRef}
				onScroll={handleScroll}
				>
				{
					learnableMoves
					.filter(move => move.name.includes(query.toLowerCase()))
					.slice(0, limit)
					.map(move => <p key={move.id}>{move.name}</p>)
				}
				</div>
			</CardContent>
    </Card>
  );
}
