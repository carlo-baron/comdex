"use client";

import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
	Background,
	BackgroundVariant,
	Controls,
	Panel,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type ColorMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NatureName } from '@/data/natures';

import pokemonSearchList from '@/data/pokemon.json'
import PokemonSearchDialog from '@/components/PokemonSearchDialog';

//#region nodes + types
import { 
    PokemonStatType,
	type PokemonType 
} from '@/types/pokemon';
import
PokemonNode, 
{ 
	type PokemonNodeType 
} from '@/components/PokemonNode';
import 
PokemonAbilityNode,
{ 
	type PokemonAbilityNodeType 
}
from '@/components/PokemonAbilityNode';
import 
PokemonStatNode,
{
	type PokemonStatNodeType
}
from '@/components/PokemonStatNode';
import 
PokemonMovesNode,
{
	type PokemonMovesNodeType,
}
from '@/components/PokemonMovesNode';
import PokemonItemNode,
{ 
	type PokemonItemNodeType
}
from '@/components/PokemonItemNode';
import PokemonEvolutionNode,
{
	type PokemonEvolutionNodeType
}
from '@/components/PokemonEvolutionNode';
//#endregion

import { useTheme } from "next-themes"

type AppNode = 
	PokemonNodeType | 
	PokemonAbilityNodeType |
	PokemonStatNodeType |
	PokemonMovesNodeType |
	PokemonItemNodeType |
	PokemonEvolutionNodeType;

const nodeTypes = {
  pokemonNode: PokemonNode,
  pokemonAbilityNode: PokemonAbilityNode,
	pokemonStatNode: PokemonStatNode,
	pokemonMovesNode: PokemonMovesNode,
	pokemonItemsNode: PokemonItemNode,
	pokemonEvolutionNode: PokemonEvolutionNode,
};

const initialEdges: Edge[] = [];

export default function Page() {
  const [nodes, setNodes] = useState<AppNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
	const [addMon, setAddMon] = useState(false);
	const { theme } = useTheme();

	const addAbilityNode = useCallback((id: string, urls: string[]) => {
		const abilityId = `${id}-abilityNode`;
		setNodes(prev => {
			if (prev.some(node => node.id === abilityId)) return prev;
			const parent = prev.find(node => node.id === id);
			const parentX = parent?.position.x ?? 0;
			const parentY = parent?.position.y ?? 0;
			return [
				...prev,
				{
					id: abilityId,
					type: 'pokemonAbilityNode',
					position: { x: parentX + 200, y: parentY },
					data: { urls },
				},
			];
		});

		setEdges(prev => {
			const edgeId = `${id}-${abilityId}`;
			if (prev.some(edge => edge.id === edgeId)) return prev;
			return [...prev, { id: edgeId, source: id, sourceHandle: `${id}-abilities`, target: abilityId }];
		});
	}, []);

	const addStatNode = useCallback((
		id: string,
		stats: PokemonStatType[],
		level: number,
		nature: NatureName 
	) => {
		const statNodeId = `${id}-statNode`;
		setNodes(prev => {
			if (prev.some(node => node.id === statNodeId)) return prev;
			const parent = prev.find(node => node.id === id);
			const parentX = parent?.position.x ?? 0;
			const parentY = parent?.position.y ?? 0;
			return [
				...prev,
				{
					id: statNodeId,
					type: 'pokemonStatNode',
					position: { x: parentX - 200, y: parentY },
					data: { stats, level, nature },
				},
			];
		});

		setEdges(prev => {
			const edgeId = `${id}-${statNodeId}`;
			if (prev.some(edge => edge.id === edgeId)) return prev;
			return [...prev, { id: edgeId, source: id, sourceHandle: `${id}-stats`, target: statNodeId }];
		});
	}, []);

	const addMovesNode = useCallback((id: string, movePool: string[]) => {
		const moveId = `${id}-movesNode`;
		setNodes(prev => {
			if (prev.some(node => node.id === moveId)) return prev;
			const parent = prev.find(node => node.id === id);
			const parentX = parent?.position.x ?? 0;
			const parentY = parent?.position.y ?? 0;
			return [
				...prev,
				{
					id: moveId,
					type: 'pokemonMovesNode',
					position: { x: parentX - 200, y: parentY },
					data: { movePool },
				},
			];
		});

		setEdges(prev => {
			const edgeId = `${id}-${moveId}`;
			if (prev.some(edge => edge.id === edgeId)) return prev;
			return [...prev, { id: edgeId, source: id, sourceHandle: `${id}-moves`, target: moveId }];
		});
	}, []);

	const addItemsNode = useCallback((id: string) => {
		const itemId = `${id}-itemNode`;
		setNodes(prev => {
			if (prev.some(node => node.id === itemId)) return prev;
			const parent = prev.find(node => node.id === id);
			const parentX = parent?.position.x ?? 0;
			const parentY = parent?.position.y ?? 0;
			return [
				...prev,
				{
					id: itemId,
					type: 'pokemonItemsNode',
					position: { x: parentX + 200, y: parentY },
					data: {},
				},
			];
		});

		setEdges(prev => {
			const edgeId = `${id}-${itemId}`;
			if (prev.some(edge => edge.id === edgeId)) return prev;
			return [...prev, { id: edgeId, source: id, sourceHandle: `${id}-items`, target: itemId }];
		});
	}, []);

	const addEvolutionNode = useCallback((id: string, name: string, sprite: string) => {
		const evoId = `${id}-evolutionNode`;
		setNodes(prev => {
			if (prev.some(node => node.id === evoId)) return prev;
			const parent = prev.find(node => node.id === id);
			const parentX = parent?.position.x ?? 0;
			const parentY = parent?.position.y ?? 0;
			return [
				...prev,
				{
					id: evoId,
					type: 'pokemonEvolutionNode',
					position: { x: parentX, y: parentY + 400 },
					data: { name: name, sprite: sprite},
				},
			];
		});

		setEdges(prev => {
			const edgeId = `${id}-${evoId}`;
			if (prev.some(edge => edge.id === edgeId)) return prev;
			return [...prev, { id: edgeId, source: id, sourceHandle: `${id}-evolution`, target: evoId }];
		});
	}, []);

	const addPokemonNode = useCallback(async (name: string) => {
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
		const data: PokemonType = await res.json();
		const uuid = crypto.randomUUID();
		setNodes(prev => [
			...prev,
			{
				id: uuid,
				type: 'pokemonNode',
				position: { x: 0, y: 0 },
				data: { 
					...data,
					onExpandAbility: addAbilityNode, 
					onExpandStats: addStatNode,
					onExpandMoves: addMovesNode,
					onExpandItems: addItemsNode,
					onExpandEvolution: addEvolutionNode
				},
			},
		]);
	}, [addAbilityNode, addStatNode, addMovesNode, addItemsNode, addEvolutionNode]);

  const onNodesChange = useCallback(
    (changes: NodeChange<AppNode>[]) =>
      setNodes(prev => applyNodeChanges(changes, prev)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges(prev => applyEdgeChanges(changes, prev)),
    [],
  );

	/* not today */
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges(prev => addEdge(params, prev)),
    [],
  );

  return (
    <div className="w-full h-screen">
      <ReactFlow
				selectionOnDrag
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
				colorMode={theme as ColorMode ?? 'dark'}
        fitView
      >
				<Background 
				variant={BackgroundVariant.Dots}
				gap={12}
				size={1}
				/>
				<Controls 
				position='bottom-right'
				orientation='horizontal'
				/>
				<Panel
				position='top-center'
				>
					<Button
					onClick={() => setAddMon(true)}
					>
						Add
						<Plus />
					</Button>
					<PokemonSearchDialog 
					open={addMon}
					onOpenChange={() => setAddMon(prev => !prev)}
					searchList={pokemonSearchList}	
					onAdd={addPokemonNode}
					/>
				</Panel>
			</ReactFlow>
    </div>
  );
}
