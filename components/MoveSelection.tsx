import { 
	useMemo,
} from "react";
import { X, Plus } from "lucide-react";
import { 
	Card,
	CardContent
} from "./ui/card";
import { MoveType } from "@/types/moves";

export default function MoveSelection(
	{
		selected,
		onSelected,
		selectedMoves,
		onRemove,
	}
	:
	{
		selected: number;
		onSelected: (index: number) => void;
		selectedMoves: (MoveType | null)[];
		onRemove: (index: number) => void;
	}
){
	const moveCards = useMemo(() => {
		const moves = [];
		for(let i = 0; i < 4; i++){
			const move = selectedMoves[i];
			moves.push(
				<Card 
				key={i}
				className={`p-0 ${selected === i && 'ring-1 ring-primary'}`}
				>
					<CardContent
					className='px-4 py-2 flex items-center justify-between'
					onClick={() => onSelected(i)}
					>
						{move 
							? <>
								<p className='text-sm font-bold truncate'>{move.name}</p>
								<X 
								size={14}
								className='shrink-0 cursor-pointer'
								onClick={(e) => {
									e.stopPropagation();
									onRemove(i);
								}}
								/>
							</>
							: <Plus className='mx-auto'/>
						}
					</CardContent>
				</Card>
			);
		}
		return moves;
	}, [selected, onSelected, selectedMoves, onRemove]);
	return(
		<section className="nodrag gap-2 mb-4 selected-moves grid grid-cols-2 grid-rows-2 max-h-24">
			{moveCards}
		</section>
	);
}
