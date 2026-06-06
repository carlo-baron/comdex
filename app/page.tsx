"use client";

import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PokemonType } from '@/types/pokemon';
import PokemonNode, { PokemonNodeType } from '@/components/PokemonNode';
import PokemonAbilityNode, { PokemonAbilityNodeType } from '@/components/PokemonAbilityNode';

type AppNode = PokemonNodeType | PokemonAbilityNodeType;

const nodeTypes = {
  pokemonNode: PokemonNode,
  pokemonAbilityNode: PokemonAbilityNode,
};

const initialEdges: Edge[] = [];

export default function Page() {
  const [nodes, setNodes] = useState<AppNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);


  useEffect(() => {
    getMon();
  }, []);

	const addAbilityNode = useCallback((id: string, url: string) => {
		const abilityId = `${id}-${url}`;
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
					data: { url },
				},
			];
		});
		setEdges(prev => {
			const edgeId = `${id}-${abilityId}`;
			if (prev.some(edge => edge.id === edgeId)) return prev;
			return [...prev, { id: edgeId, source: id, target: abilityId }];
		});
	}, []);

	const getMon = useCallback(async () => {
		const res = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
		const data: PokemonType = await res.json();
		const uuid = crypto.randomUUID();
		setNodes(prev => [
			...prev,
			{
				id: uuid,
				type: 'pokemonNode',
				position: { x: 0, y: 0 },
				data: { ...data, onExpandAbility: addAbilityNode },
			},
		]);
	}, [addAbilityNode]);

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
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
				position='bottom-right'
				>
					<div className="mb-8">
						<Button
						onClick={getMon}
						>Add</Button>
					</div>
				</Panel>
			</ReactFlow>
    </div>
  );
}
