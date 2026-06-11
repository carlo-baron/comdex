import moves from "@/data/moves.json";

const url = 'https://pokeapi.co/api/v2/pokemon/pikachu';

const res = await fetch(url);
const data = await res.json();

const learnableMoves = data.moves.map(move => {
	return move.move.name;
})

console.log(learnableMoves[0]);
console.log(moves.find(move => move.name === learnableMoves[0]));
console.log(moves.filter(move => learnableMoves.includes(move.name)));
