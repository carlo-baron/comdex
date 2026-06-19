export const abbreviateStat = (statName: string): string => {
	const map: Record<string, string> = {
		'attack': 'Atk',
		'defense': 'Def',
		'special-attack': 'SpA',
		'special-defense': 'SpD',
		'speed': 'Spe',
		'hp': 'HP',
	};
	return map[statName] ?? statName;
};

