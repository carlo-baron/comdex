"use client";
import { memo } from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
	CardContent,
} from "./ui/card";

export type PokemonMovesNodeProps = {
	movePool: string[]
}

export type PokemonMovesNodeType = Node<PokemonMovesNodeProps, 'pokemonMovesNode'>;
function NODETEMPLATE({ selected, data }: NodeProps<PokemonMovesNodeType>) {
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
			</CardContent>
		</Card>
	);
}
export default memo(NODETEMPLATE);
