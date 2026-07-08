export function formatPokemonName(name: string): string {
	return name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function formatStatName(stat: string): string {
	const mapping: Record<string, string> = {
		hp: 'HP',
		attack: 'Attack',
		defense: 'Defense',
		'special-attack': 'Sp. Atk',
		'special-defense': 'Sp. Def',
		speed: 'Speed'
	};
	return mapping[stat] || stat;
}

export function getPokemonId(url: string): number {
	const parts = url.split('/').filter(Boolean);
	return parseInt(parts[parts.length - 1], 10);
}
