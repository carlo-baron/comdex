"use client";
import { title } from '@/utils/titleCase';
import { 
	memo,
	useState,
	useMemo,
	useRef
} from 'react';
import { NodeProps, Node, Handle, Position } from '@xyflow/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
	CardContent,
} from "./ui/card";
import { Plus } from 'lucide-react';
import items from '@/data/items.json';
import { ItemType } from '@/types/items';
import { Input } from './ui/input';
import { X } from 'lucide-react';

export type PokemonItemNodeType = Node<Record<string, never>, 'pokemonItemsNode'>;

function PokemonItemNode({ selected }: NodeProps<PokemonItemNodeType>) {
	const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
	const [query, setQuery] = useState('');
	const [limit, setLimit] = useState(20);
	const viewportRef = useRef<HTMLDivElement | null>(null);

	const handleScroll = () => {
		const el = viewportRef.current;
		if (!el) return;
		const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
		if (isBottom) {
			if (items.filter(item => item.name.includes(query.toLowerCase())).length > limit) {
				setLimit(prev => prev + 20);
			}
		}
	};

	const itemsMap = useMemo(() => {
		return items
			.filter(item => item.name.includes(query.toLowerCase()))
			.slice(0, limit)
			.map(item => 
					 <ItemCard 
					 key={item.id}
					 item={item as ItemType}
					 onSelect={(item) => setSelectedItem(item)}
					 />)
	}, [limit, query]);

	return (
		<Card className={`w-80 ${selected ? 'ring-2 ring-primary' : ''}`}>
			<Handle type="target" position={Position.Left} />
			<CardHeader className='text-center'>
				<CardTitle className="text-xl font-bold text-center">
					Items
				</CardTitle>
				<CardDescription>
					Choose 1 item to help your pokemon.
				</CardDescription>
			</CardHeader>
			<CardContent className='nodrag nowheel cursor-pointer'>
				<Card className="p-0 mb-2">
					<CardContent className="px-4 py-2">
						{selectedItem === null ? 
							(
								<span className='w-full flex justify-center'><Plus /></span>
							) 
								: 
							(
								<div className="flex flex-col gap-2 relative">
									<X 
									className='absolute right-0 top-0'
									onClick={() => setSelectedItem(null)}
									/>
									<span className='flex gap-2 items-center justify-center'>
										<img 
										src={selectedItem.sprite ?? '/missing_sprite.png'}
										alt="Item Image"
										className='aspect-square w-10 object-cover'
										/>
										<p className="font-bold text-lg">
											{title(selectedItem?.name)}
										</p>
									</span>
									<p className='text-center w-full'>{selectedItem.effect ?? "Effect entry not found."}</p>
								</div>
							)
						}
					</CardContent>
				</Card>
				<Input 
				onChange={(e) => setQuery(e.target.value)}
				type='text'
				placeholder='Search for an item...'
				className='bg'
				/>
				<div 
				className='p-2 h-72 overflow-y-auto'
				ref={viewportRef}
				onScroll={handleScroll}
				>
					{itemsMap}
				</div>
			</CardContent>
		</Card>
	);
}
export default memo(PokemonItemNode);


function ItemCard({ item, onSelect } : { item: ItemType; onSelect: (item: ItemType) => void }){
	return(
		<Card
		className='mb-2 cursor-pointer p-0'
		onClick={() => onSelect(item)}
		>
			<CardContent className='flex flex-col gap-2 px-4 py-2'>
				<span className="flex justify-center items-center w-full">
					<img 
					src={item.sprite ?? '/missing_sprite.png'}
					alt="Item Image"
					className='aspect-square w-10 object-cover'
					/>
					<p className='font-bold text-md text-center'>{title(item.name)}</p>
				</span>
				<p className='text-center'>{item.effect ?? "Effect entry not found."}</p>
			</CardContent>
		</Card>
	);
}
