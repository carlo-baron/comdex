"use client";

import pokemons from '@/data/pokemon.json';
import { title } from "@/utils/titleCase";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { 
	Card,
	CardContent
} from "./ui/card";
import { usePokemonDataStore } from "@/hooks/PokemonDataStore";
import type { PokemonData } from "@/hooks/PokemonDataStore";

export default function BuiltMonsDialog(
	{
		open,
		onOpenChange
	}
	:
	{
		open: boolean;
		onOpenChange: () => void;
	}
){
	const pokemons = usePokemonDataStore(state => state.pokemon);
	const [query, setQuery] = useState<string>('');

	return(
		<Dialog
		open={open}
		onOpenChange={onOpenChange}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Search Pokemons 
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Input
					type='text'
					placeholder="pikachu"
					onChange={(e) => setQuery(e.target.value)}
					/>
					<div
					className='overflow-y-auto max-h-81'
					>
						<div 
						className="p-2 mon-list flex flex-col gap-2"
						>
							{
								Object.values(pokemons)
									.filter(pokemon => pokemon.name.includes(query.toLowerCase()))
									.map((pokemon, index) => {
										return(
											<BuiltMonItem
											key={index}
											data={pokemon}
											onSelect={() => console.log()}
											/>
										);
									})
							}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function BuiltMonItem(
	{
		data,
		onSelect,
	}
	:
	{
		data: PokemonData;
		onSelect: (name: string) => void;
	}
){
	const pokemonDataHelper = pokemons.find(pokemon => pokemon.name === data.name);
	const sprite = pokemonDataHelper?.sprite ?? '';
	const types = pokemonDataHelper?.types ?? [];

	return(
		<Card
		onClick={() => onSelect(data.name)}
		>
			<CardContent
			className='flex gap-4 cursor-pointer'
			>
				<img 
				src={sprite}
				alt={data.name}
				className='aspect-square w-15'
				/>
				<div className="info">
					<p className="font-bold text-md">{title(data.name)}</p>
					<span className="flex gap-4">
						{
							types.map(( type, index ) => {
								console.log(type)
								return(
									<p
									key={index}
									>{type}</p>
								)
							})
						}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
