import { z } from 'zod';
import { getCached, setCached } from './cache';
import {
	BerryListSchema,
	BerrySchema,
	EvolutionChainSchema,
	GenerationSchema,
	PokemonListSchema,
	PokemonSchema,
	PokemonSpeciesSchema,
	TypeSchema,
	type Berry,
	type BerryList,
	type EvolutionChain,
	type Generation,
	type Pokemon,
	type PokemonList,
	type PokemonSpecies,
	type Type
} from './schemas';

const BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchWithCache<T>(url: string, schema: z.ZodType<T>): Promise<T> {
	const cached = getCached<T>(url);
	if (cached) {
		return cached;
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
	}

	const data = await response.json();
	const parsed = schema.parse(data);
	setCached(url, parsed);

	return parsed;
}

export async function fetchPokemonList(limit = 30, offset = 0): Promise<PokemonList> {
	const url = `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
	return fetchWithCache(url, PokemonListSchema);
}

export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
	const url = `${BASE_URL}/pokemon/${nameOrId}`;
	return fetchWithCache(url, PokemonSchema);
}

export async function fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
	const url = `${BASE_URL}/pokemon-species/${nameOrId}`;
	return fetchWithCache(url, PokemonSpeciesSchema);
}

export async function fetchEvolutionChain(id: number): Promise<EvolutionChain> {
	const url = `${BASE_URL}/evolution-chain/${id}`;
	return fetchWithCache(url, EvolutionChainSchema);
}

export async function fetchType(name: string): Promise<Type> {
	const url = `${BASE_URL}/type/${name}`;
	return fetchWithCache(url, TypeSchema);
}

export async function fetchGeneration(id: number): Promise<Generation> {
	const url = `${BASE_URL}/generation/${id}`;
	return fetchWithCache(url, GenerationSchema);
}

export async function fetchBerryList(limit = 30, offset = 0): Promise<BerryList> {
	const url = `${BASE_URL}/berry?limit=${limit}&offset=${offset}`;
	return fetchWithCache(url, BerryListSchema);
}

export async function fetchBerry(nameOrId: string | number): Promise<Berry> {
	const url = `${BASE_URL}/berry/${nameOrId}`;
	return fetchWithCache(url, BerrySchema);
}

export const POKEMON_TYPES = [
	'normal',
	'fire',
	'water',
	'electric',
	'grass',
	'ice',
	'fighting',
	'poison',
	'ground',
	'flying',
	'psychic',
	'bug',
	'rock',
	'ghost',
	'dragon',
	'dark',
	'steel',
	'fairy'
] as const;

export type PokemonTypeName = (typeof POKEMON_TYPES)[number];
