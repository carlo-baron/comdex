"use client";
import { title } from "@/utils/titleCase";
import { useState } from "react";
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
		onOpenChange,
		onSelect,
	}
	:
	{
		open: boolean;
		onOpenChange: () => void;
		onSelect: (id: string) => void;
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
								Object.entries(pokemons)
									.filter(([, pokemon]) => pokemon.name.includes(query.toLowerCase()))
									.map(([id, pokemon]) => {
										return(
											<BuiltMonItem
											key={id}
											data={pokemon}
											onSelect={() => onSelect(id)}
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
		onSelect: () => void;
	}
){
	return(
		<Card
		onClick={onSelect}
		>
			<CardContent
			className='flex gap-4 cursor-pointer'
			>
				<img 
				src={data.sprite}
				alt={data.name}
				className='aspect-square w-15'
				/>
				<div className="info">
					<p className="font-bold text-md">{title(data.name)}</p>
					<span className="flex gap-4">
						{
							data.types.map((type, index) => {
								return(
									<p
									key={index}
									>{title(type.type.name)}</p>
								)
							})
						}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
