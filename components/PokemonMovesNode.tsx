"use client";
import { title } from '@/utils/titleCase';
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
	CardContent,
	CardFooter
} from "./ui/card";
import { Input } from './ui/input';
import moves from "@/data/moves.json";
import { MoveType } from '@/types/moves';

export type PokemonMovesNodeProps = {
	movePool: string[]
}

export type PokemonMovesNodeType = Node<PokemonMovesNodeProps, 'pokemonMovesNode'>;

function PokemonMovesNode({ selected, data }: NodeProps<PokemonMovesNodeType>) {
	const [query, setQuery] = useState('');
	const [limit, setLimit] = useState(20);
	const [learnableMoves] = useState<MoveType[]>(() => moves.filter(move => data.movePool.includes(move.name)));
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

	const moveMap = useMemo(() => {
		return learnableMoves
					.filter(move => move.name.includes(query.toLowerCase()))
					.slice(0, limit)
					.map(move => <MoveCard key={move.id} move={move} />)
	}, [learnableMoves, limit, query]);

  return (
		<Card className={`w-80 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Right} />
      <CardHeader className='text-center'>
        <CardTitle className="text-xl font-bold text-center">
         	Moves	
        </CardTitle>
        <CardDescription>
					Choose 4 moves(soon), and see the pokemon&apos;s move pool.	
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
				className='p-2 h-72 overflow-y-auto'
				ref={viewportRef}
				onScroll={handleScroll}
				>
				{
					moveMap
				}
				</div>
			</CardContent>
    </Card>
  );
}

export default memo(PokemonMovesNode);

function MoveCard({ move } : { move: MoveType; }){
	return(
		<Card
		className='mb-2'
		>
			<CardContent
			className='flex flex-col gap-2'
			>
				<p
				className='text-center font-bold text-xl'
				>{title(move.name)}</p>
				<span className="flex gap-4">
					<span className="flex gap-2 flex-1 justify-between">
						<div className="flex flex-col text-center">
							<p>Power</p>
							<p className='font-bold textlg'>{move.power}</p>
						</div>
						<div className="flex flex-col text-center">
							<p>Accuracy</p>
							<p className='font-bold textlg'>{move.accuracy}</p>
						</div>
						<div className="flex flex-col text-center">
							<p>PP</p>
							<p className='font-bold textlg'>{move.pp}</p>
						</div>
					</span>
					<div className='flex flex-col'>
						<p>
							{move.damage_class}
						</p>
					</div>
				</span>
				<p className='text-center'>{move.effect}</p>
			</CardContent>
		</Card>
	);
}
