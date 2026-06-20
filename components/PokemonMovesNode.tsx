"use client";
import { title } from '@/utils/titleCase';
import { 
	useState,
	useRef,
	useMemo,
	useCallback,
	memo
} from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
	CardContent,
} from "./ui/card";
import MoveSelection from './MoveSelection';
import { Input } from './ui/input';
import moves from "@/data/moves.json";
import { MoveType } from '@/types/moves';
export type PokemonMovesNodeProps = {
	movePool: string[]
}
export type PokemonMovesNodeType = Node<PokemonMovesNodeProps, 'pokemonMovesNode'>;
import { usePokemonDataStore } from '@/hooks/PokemonDataStore';

function PokemonMovesNode({ id, selected, data }: NodeProps<PokemonMovesNodeType>) {
	const [query, setQuery] = useState('');
	const [limit, setLimit] = useState(20);
	const [learnableMoves] = useState<MoveType[]>(
		() => 
			(moves as MoveType[]).filter(
				move => data.movePool.includes(move.name)
			)
	);
	const [selectedCard, setSelectedCard] = useState(0);

  const parentId = id.replace('-movesNode', '');
  const pokemonData = usePokemonDataStore(state => state.pokemon[parentId]);
  const updatePokemon = usePokemonDataStore(state => state.updatePokemon);

	const selectedMoves = useMemo(() => {
		return pokemonData?.selectedMoves ?? [null, null, null, null];
	}, [pokemonData]);

	const viewportRef = useRef<HTMLDivElement | null>(null);
	const handleScroll = () => {
		const el = viewportRef.current;
		if (!el) return;
		const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
		if (isBottom) {
			if (learnableMoves.filter(move => move.name.includes(query.toLowerCase())).length > limit) {
				setLimit(prev => prev + 20);
			}
		}
	};
	const handleSelectMove = useCallback((move: MoveType) => {
		const next = [...selectedMoves];
		next[selectedCard] = move;
		updatePokemon(parentId, {
			selectedMoves: next	
		});
		setSelectedCard(prev => {
			const nextEmpty = selectedMoves.findIndex((m, i) => i !== selectedCard && m === null);
			return nextEmpty === -1 ? prev : nextEmpty;
		});
	}, [selectedCard, selectedMoves, updatePokemon, parentId]);
	const handleRemoveMove = useCallback((index: number) => {
		const next = [...selectedMoves];
		next[index] = null;
		updatePokemon(parentId, {
			selectedMoves: next	
		});

		setSelectedCard(index);
	}, [parentId, updatePokemon, selectedMoves]);

	const moveMap = useMemo(() => {
		return learnableMoves
			.filter(move => !selectedMoves.some(s => s?.name === move.name))
			.filter(move => move.name.includes(query.toLowerCase()))
			.slice(0, limit)
			.map(move => <MoveCard key={move.id} move={move} onSelect={handleSelectMove} />)
	}, [learnableMoves, limit, query, handleSelectMove, selectedMoves]);

	return (
		<Card className={`w-80 ${selected ? 'ring-2 ring-primary' : ''}`}>
			<Handle type="target" position={Position.Right} />
			<CardHeader className='text-center'>
				<CardTitle className="text-xl font-bold text-center">
					Moves
				</CardTitle>
				<CardDescription>
					Choose 4 moves and see the pokemon&apos;s move pool.
				</CardDescription>
			</CardHeader>
			<CardContent className='nodrag nowheel cursor-pointer'>
				<MoveSelection 
				selected={selectedCard}
				onSelected={(index) => setSelectedCard(index)}
				selectedMoves={selectedMoves}
				onRemove={handleRemoveMove}
				/>
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
					{moveMap}
				</div>
			</CardContent>
		</Card>
	);
}
export default memo(PokemonMovesNode);

function MoveCard({ move, onSelect } : { move: MoveType; onSelect: (move: MoveType) => void }){
	return(
		<Card
		className='mb-2 cursor-pointer'
		onClick={() => onSelect(move)}
		>
			<CardContent className='flex flex-col gap-2'>
				<p className='text-center font-bold text-xl'>{title(move.name)}</p>
				<span className="flex gap-4">
					<span className="flex gap-2 flex-1 justify-between">
						<div className="flex flex-col text-center">
							<p>Power</p>
							<p className='font-bold text-lg'>{move.power ?? '—'}</p>
						</div>
						<div className="flex flex-col text-center">
							<p>Accuracy</p>
							<p className='font-bold text-lg'>{move.accuracy ?? '—'}</p>
						</div>
						<div className="flex flex-col text-center">
							<p>PP</p>
							<p className='font-bold text-lg'>{move.pp}</p>
						</div>
					</span>
					<div className='flex flex-col'>
						<p>{move.damage_class}</p>
					</div>
				</span>
				<p className='text-center text-sm text-muted-foreground'>{move.effect}</p>
			</CardContent>
		</Card>
	);
}
