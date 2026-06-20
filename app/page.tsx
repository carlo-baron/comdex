"use client";
import { title } from '@/utils/titleCase';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect } from 'react';
import { Plus, Trash, Clipboard } from 'lucide-react';
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
import { usePokemonDataStore } from '@/hooks/PokemonDataStore';
import { abbreviateStat } from '@/utils/abbreviateStat';
import { toast } from 'sonner';

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
	const { deleteElements, screenToFlowPosition } = useReactFlow();
  const [addMon, setAddMon] = useState(false);
  const { resolvedTheme } = useTheme();
	const removePokemonData = usePokemonDataStore(state => state.removePokemon);
	const pokemons = usePokemonDataStore(state => state.pokemon);

  const nodes = useNodeStore(state => state.nodes);
  const edges = useNodeStore(state => state.edges);
  const addPokemonNode = useNodeStore(state => state.addPokemonNode);
  const onNodesChange = useNodeStore(state => state.onNodesChange);
  const onEdgesChange = useNodeStore(state => state.onEdgesChange);
  const rehydrateCallbacks = useNodeStore(state => state.rehydrateCallbacks);

  useEffect(() => {
    rehydrateCallbacks();
  }, [rehydrateCallbacks]);

	const pokePasteCopy = useCallback(() => {
		return Object.values(pokemons)
			.map(e1 => {
				if (!e1) return null;
				const hasEv = Object.values(e1.evs).some(value => value > 0);
				const hasIv = Object.values(e1.ivs).some(value => value > 0);
				const name = title(e1.name);
				const item = e1.selectedItem ? ' @ ' + title(e1.selectedItem.name) : '';
				const ability = e1.selectedAbility ? `Ability: ${title(e1.selectedAbility.name)}` : '';
				const evs = hasEv
					? 'EVs: ' +
						Object.entries(e1.evs)
							.filter(([, value]) => value !== 0)
							.map(([key, value]) => `${value} ${abbreviateStat(key)}`)
							.join(' / ')
					: '';
				const ivs = hasIv
					? 'IVs: ' +
						Object.entries(e1.ivs)
							.filter(([, value]) => value !== 0)
							.map(([key, value]) => `${value} ${abbreviateStat(key)}`)
							.join(' / ')
					: '';
				const nature = `${title(e1.nature)} Nature`;
				const moves = Object.values(e1.selectedMoves)
					.filter(move => move !== null)
					.map(move => "- " + title(move.name))
					.join("\n");

				return `${name + item}\n${ability}\n${evs}\n${ivs}\n${nature}\n${moves}`;
			})
			.filter(Boolean)
			.join("\n\n");
	}, [pokemons]);

  const handleAddPokemon = useCallback(
    async (name: string) => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data: PokemonType = await res.json();

			const center = screenToFlowPosition({
				x: window.innerWidth / 2 - 80,
				y: window.innerHeight / 2 - 100
			});

      addPokemonNode(data, center);
    },
    [addPokemonNode, screenToFlowPosition]
  );

  return (
    <div className="w-full h-screen">
      <ReactFlow
        selectionOnDrag
        nodes={nodes}
        edges={edges}
				onNodesDelete={(nodes) => nodes.forEach(node => removePokemonData(node.id))}
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
				<Panel position="top-right">
					{
						nodes.length > 0 && (
							<Button
							onClick={() => {
								navigator.clipboard.writeText(pokePasteCopy())
								toast.success("Team Copied!")
							}}
							>
								<Clipboard />
							</Button>
						)
					}
				</Panel>
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
