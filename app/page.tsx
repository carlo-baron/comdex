"use client";
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  MiniMap,
  type ColorMode,
	useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import pokemonSearchList from '@/data/pokemon.json';
import PokemonSearchDialog from '@/components/PokemonSearchDialog';
import { type PokemonType } from '@/types/pokemon';
import PokemonNode, { type PokemonNodeType } from '@/components/PokemonNode';
import PokemonAbilityNode, { type PokemonAbilityNodeType } from '@/components/PokemonAbilityNode';
import PokemonStatNode, { type PokemonStatNodeType } from '@/components/PokemonStatNode';
import PokemonMovesNode, { type PokemonMovesNodeType } from '@/components/PokemonMovesNode';
import PokemonItemNode, { type PokemonItemNodeType } from '@/components/PokemonItemNode';
import PokemonEvolutionNode, { type PokemonEvolutionNodeType } from '@/components/PokemonEvolutionNode';
import { useTheme } from 'next-themes';
import { useNodeStore } from '@/hooks/AppStore';

export type AppNode =
  | PokemonNodeType
  | PokemonAbilityNodeType
  | PokemonStatNodeType
  | PokemonMovesNodeType
  | PokemonItemNodeType
  | PokemonEvolutionNodeType;

const nodeTypes = {
  pokemonNode: PokemonNode,
  pokemonAbilityNode: PokemonAbilityNode,
  pokemonStatNode: PokemonStatNode,
  pokemonMovesNode: PokemonMovesNode,
  pokemonItemsNode: PokemonItemNode,
  pokemonEvolutionNode: PokemonEvolutionNode,
};

export default function Page() {
	const [selectedNodes, setSelectedNodes] = useState<AppNode[]>([]);
	const { deleteElements } = useReactFlow();
  const [addMon, setAddMon] = useState(false);
  const { resolvedTheme } = useTheme();

  const nodes = useNodeStore(state => state.nodes);
  const edges = useNodeStore(state => state.edges);
  const addPokemonNode = useNodeStore(state => state.addPokemonNode);
  const onNodesChange = useNodeStore(state => state.onNodesChange);
  const onEdgesChange = useNodeStore(state => state.onEdgesChange);
  const rehydrateCallbacks = useNodeStore(state => state.rehydrateCallbacks);

  useEffect(() => {
    rehydrateCallbacks();
  }, [rehydrateCallbacks]);

  const handleAddPokemon = useCallback(
    async (name: string) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data: PokemonType = await res.json();
      addPokemonNode(data);
    },
    [addPokemonNode]
  );

  return (
    <div className="w-full h-screen">
      <ReactFlow
        selectionOnDrag
        nodes={nodes}
        edges={edges}
				onSelectionChange={(selected) => setSelectedNodes(selected.nodes)}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode={(resolvedTheme as ColorMode) ?? 'dark'}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
        <Controls
          position="center-right"
          orientation="vertical"
        />
        <Panel position="top-center">
					<div className="flex gap-2">
						<Button onClick={() => setAddMon(true)}>
							Add
							<Plus />
						</Button>

						{
							selectedNodes.length > 0 && (
								<Button
								variant='destructive'
								onClick={() => deleteElements({ nodes: selectedNodes })}
								>
									<Trash />
								</Button>
							)
						}
					</div>

          <PokemonSearchDialog
            open={addMon}
            onOpenChange={() => setAddMon(prev => !prev)}
            searchList={pokemonSearchList}
            onAdd={handleAddPokemon}
          />
        </Panel>
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
