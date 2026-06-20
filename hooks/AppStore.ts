import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
	applyNodeChanges,
	applyEdgeChanges,
	type Edge,
	type NodeChange,
	type EdgeChange,
} from '@xyflow/react';

import { NatureName } from '@/data/natures';
import {
	PokemonStatType,
	type PokemonType,
} from '@/types/pokemon';

import type { AppNode } from '@/app/page';
import { usePokemonDataStore } from './PokemonDataStore';

type NodeStore = {
	nodes: AppNode[];
	edges: Edge[];

	addPokemonNode: (pokemon: PokemonType, position: { x: number, y: number }) => void;
	addAbilityNode: (id: string, urls: string[]) => void;
	addStatNode: (id: string, stats: PokemonStatType[], level: number, nature: NatureName) => void;
	addMovesNode: (id: string, movePool: string[]) => void;
	addItemsNode: (id: string) => void;
	addEvolutionNode: (id: string, name: string, sprite: string) => void;
	onNodesChange: (changes: NodeChange<AppNode>[]) => void;
	onEdgesChange: (changes: EdgeChange[]) => void;
	rehydrateCallbacks: () => void;
	clear: () => void;
};

export const useNodeStore = create<NodeStore>()(
	persist(
		(set) => ({
			nodes: [],
			edges: [],

			addPokemonNode: ( pokemon, position = { x: 0, y: 0} ) => {
				const id = crypto.randomUUID();
				const store = useNodeStore.getState();

				usePokemonDataStore.getState().initPokemon(id);
				usePokemonDataStore.getState().updatePokemon(id, { name: pokemon.name });

				set(state => ({
					nodes: [
						...state.nodes,
						{
							id,
							type: 'pokemonNode',
							position,
							data: {
								...pokemon,
								onExpandAbility: store.addAbilityNode,
								onExpandStats: store.addStatNode,
								onExpandMoves: store.addMovesNode,
								onExpandItems: store.addItemsNode,
								onExpandEvolution: store.addEvolutionNode,
							},
						},
					],
				}));
			},

			addAbilityNode: (parentId, urls) => {
				const nodeId = `${parentId}-abilityNode`;
				set(state => {
					if (state.nodes.some(node => node.id === nodeId)) return state;
					return {
						nodes: [
							...state.nodes,
							{
								id: nodeId,
								parentId,
								type: 'pokemonAbilityNode',
								position: { x: 300, y: 0 },
								data: { urls },
							} as AppNode,
						],
						edges: [
							...state.edges,
							{
								id: `${parentId}-${nodeId}`,
								source: parentId,
								sourceHandle: `${parentId}-abilities`,
								target: nodeId,
							},
						],
					};
				});
			},

			addStatNode: (parentId, stats, level, nature) => {
				const nodeId = `${parentId}-statNode`;
				set(state => {
					if (state.nodes.some(node => node.id === nodeId)) return state;
					return {
						nodes: [
							...state.nodes,
							{
								id: nodeId,
								parentId,
								type: 'pokemonStatNode',
								position: { x: -400, y: 0 },
								data: { stats, level, nature },
							} as AppNode,
						],
						edges: [
							...state.edges,
							{
								id: `${parentId}-${nodeId}`,
								source: parentId,
								sourceHandle: `${parentId}-stats`,
								target: nodeId,
							},
						],
					};
				});
			},

			addMovesNode: (parentId, movePool) => {
				const nodeId = `${parentId}-movesNode`;
				set(state => {
					if (state.nodes.some(node => node.id === nodeId)) return state;
					return {
						nodes: [
							...state.nodes,
							{
								id: nodeId,
								parentId,
								type: 'pokemonMovesNode',
								position: { x: -400, y: 100 },
								data: { movePool },
							} as AppNode,
						],
						edges: [
							...state.edges,
							{
								id: `${parentId}-${nodeId}`,
								source: parentId,
								sourceHandle: `${parentId}-moves`,
								target: nodeId,
							},
						],
					};
				});
			},

			addItemsNode: parentId => {
				const nodeId = `${parentId}-itemNode`;
				set(state => {
					if (state.nodes.some(node => node.id === nodeId)) return state;
					return {
						nodes: [
							...state.nodes,
							{
								id: nodeId,
								parentId,
								type: 'pokemonItemsNode',
								position: { x: 300, y: 100 },
								data: {},
							} as AppNode,
						],
						edges: [
							...state.edges,
							{
								id: `${parentId}-${nodeId}`,
								source: parentId,
								sourceHandle: `${parentId}-items`,
								target: nodeId,
							},
						],
					};
				});
			},

			addEvolutionNode: (parentId, name, sprite) => {
				const nodeId = `${parentId}-evolutionNode`;
				set(state => {
					if (state.nodes.some(node => node.id === nodeId)) return state;
					return {
						nodes: [
							...state.nodes,
							{
								id: nodeId,
								parentId,
								type: 'pokemonEvolutionNode',
								position: { x: -50, y: 400 },
								data: { name, sprite },
							} as AppNode,
						],
						edges: [
							...state.edges,
							{
								id: `${parentId}-${nodeId}`,
								source: parentId,
								sourceHandle: `${parentId}-evolution`,
								target: nodeId,
							},
						],
					};
				});
			},

			rehydrateCallbacks: () => {
				const store = useNodeStore.getState();
				set(state => ({
					nodes: state.nodes.map(node => {
						if (node.type !== 'pokemonNode') return node;
						return {
							...node,
							data: {
								...node.data,
								onExpandAbility: store.addAbilityNode,
								onExpandStats: store.addStatNode,
								onExpandMoves: store.addMovesNode,
								onExpandItems: store.addItemsNode,
								onExpandEvolution: store.addEvolutionNode,
							},
						};
					}),
				}));
			},

			onNodesChange: changes => {
				const removedPokemonIds = changes
				.filter(c => c.type === 'remove')
				.map(c => (c as { id: string }).id)
				.filter(id => !id.includes('-'));

				if (removedPokemonIds.length > 0) {
					removedPokemonIds.forEach(id => {
						usePokemonDataStore.getState().removePokemon(id);
					});
				}

				set(state => ({
					nodes: applyNodeChanges(changes, state.nodes),
				}));
			},

			onEdgesChange: changes => {
				set(state => ({
					edges: applyEdgeChanges(changes, state.edges),
				}));
			},

			clear: () => {
				set({ nodes: [], edges: [] });
			},
		}),
		{
			name: 'comdex-store',
			partialize: (state) => ({
				nodes: state.nodes.map(node => {
					if (node.type !== 'pokemonNode') return node;
					const { onExpandAbility, onExpandStats, onExpandMoves, onExpandItems, onExpandEvolution, ...rest } = node.data as any;
					return { ...node, data: rest };
				}),
				edges: state.edges,
			}),
		}
	)
);
