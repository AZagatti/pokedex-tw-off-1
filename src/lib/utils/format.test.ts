import { describe, expect, it } from 'vitest';
import { formatPokemonName, formatStatName, getPokemonId } from './format';

describe('formatPokemonName', () => {
	it('capitalizes single word names', () => {
		expect(formatPokemonName('pikachu')).toBe('Pikachu');
	});

	it('handles hyphenated names', () => {
		expect(formatPokemonName('nidoran-f')).toBe('Nidoran F');
	});

	it('handles multiple hyphens', () => {
		expect(formatPokemonName('ho-oh')).toBe('Ho Oh');
	});
});

describe('formatStatName', () => {
	it('formats HP correctly', () => {
		expect(formatStatName('hp')).toBe('HP');
	});

	it('formats special-attack correctly', () => {
		expect(formatStatName('special-attack')).toBe('Sp. Atk');
	});

	it('formats special-defense correctly', () => {
		expect(formatStatName('special-defense')).toBe('Sp. Def');
	});

	it('formats attack correctly', () => {
		expect(formatStatName('attack')).toBe('Attack');
	});
});

describe('getPokemonId', () => {
	it('extracts ID from Pokemon URL', () => {
		expect(getPokemonId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
	});

	it('extracts ID from species URL', () => {
		expect(getPokemonId('https://pokeapi.co/api/v2/pokemon-species/1/')).toBe(1);
	});

	it('extracts ID from URL without trailing slash', () => {
		expect(getPokemonId('https://pokeapi.co/api/v2/evolution-chain/10')).toBe(10);
	});
});
