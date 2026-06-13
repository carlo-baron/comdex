"use client";
import { 
	useState,
	useEffect,
	useRef,
} from "react";
import {
  Dialog,
	DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import type { PokemonSearchList } from "@/types/pokemon";

export default function PokemonSearchDialog(
	{
		open,
		onOpenChange,
		searchList,
		onAdd
	}
		:
	{
		open: boolean;			
		onOpenChange: () => void
		searchList: PokemonSearchList[]
		onAdd: (name: string) => void;
	}
){
	const [query, setQuery] = useState<string>('');
	const [limit, setLimit] = useState<number>(20);
	const viewportRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    const el = viewportRef.current
    if (!el) return

    const isBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 10

    if (isBottom) {
			if(searchList.filter(pokemon => pokemon.name.includes(query.toLowerCase())).length > 20){
      	setLimit(prev => prev + 20);
			}
    }
  }

	return(
		<Dialog
		open={open}
		onOpenChange={onOpenChange}
		>
			<DialogContent>
				<DialogHeader className="text-center">
					<DialogTitle>Add Pokemon</DialogTitle>
					<DialogDescription>Find your favorite pokemon and add them as a node.</DialogDescription>
				</DialogHeader>
				<Input 
				onChange={(e) => setQuery(e.target.value)}
				type='text'
				placeholder='pikachu'
				/>
				<div
				className='h-72 overflow-y-auto'
				ref={viewportRef}
				onScroll={handleScroll}
				>
					<div 
					className="p-2 mon-list flex flex-col gap-2"
					>
						{
							searchList
								.filter(pokemon => pokemon.name.includes(query.toLowerCase()))
								.slice(0, limit)
								.map((pokemon, index) => {
									return(
										<PokemonListItem 
										key={index}
										data={pokemon}
										onSelect={onAdd}
										/>
									);
								})
						}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function PokemonListItem(
	{
		data,
		onSelect,
	}
	:
	{
		data: PokemonSearchList
		onSelect: (name: string) => void;
	}
){
	return(
		<Card
		onClick={() => onSelect(data.name)}
		>
			<CardContent
			className='flex gap-4 cursor-pointer'
			>
				<img 
				src={data.sprite ?? ''}
				alt={data.name}
				className='aspect-square w-15'
				/>
				<div className="info">
					<p className="font-bold text-md">{data.name}</p>
					<span className="flex gap-4">
						{
							data.types.map(( type, index ) => {
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
