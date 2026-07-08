import { z } from 'zod';

// Common schemas
const NamedAPIResource = z.object({
	name: z.string(),
	url: z.string()
});

const APIResource = z.object({
	url: z.string()
});

// Pokemon type schema
export const PokemonTypeSchema = z.object({
	slot: z.number(),
	type: NamedAPIResource
});

// Pokemon sprite schema
export const PokemonSpritesSchema = z.object({
	front_default: z.string().nullable(),
	front_shiny: z.string().nullable(),
	front_female: z.string().nullable(),
	front_shiny_female: z.string().nullable(),
	back_default: z.string().nullable(),
	back_shiny: z.string().nullable(),
	back_female: z.string().nullable(),
	back_shiny_female: z.string().nullable(),
	other: z
		.object({
			'official-artwork': z
				.object({
					front_default: z.string().nullable(),
					front_shiny: z.string().nullable()
				})
				.optional()
		})
		.optional()
});

// Pokemon stat schema
export const PokemonStatSchema = z.object({
	base_stat: z.number(),
	effort: z.number(),
	stat: NamedAPIResource
});

// Pokemon ability schema
export const PokemonAbilitySchema = z.object({
	ability: NamedAPIResource,
	is_hidden: z.boolean(),
	slot: z.number()
});

// Pokemon move schema
export const PokemonMoveSchema = z.object({
	move: NamedAPIResource,
	version_group_details: z.array(z.unknown())
});

// Main Pokemon schema
export const PokemonSchema = z.object({
	id: z.number(),
	name: z.string(),
	height: z.number(),
	weight: z.number(),
	sprites: PokemonSpritesSchema,
	types: z.array(PokemonTypeSchema),
	stats: z.array(PokemonStatSchema),
	abilities: z.array(PokemonAbilitySchema),
	moves: z.array(PokemonMoveSchema),
	species: NamedAPIResource,
	cries: z
		.object({
			latest: z.string().optional(),
			legacy: z.string().optional()
		})
		.optional()
});

// Pokemon list schema
export const PokemonListSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(NamedAPIResource)
});

// Pokemon species schema
export const PokemonSpeciesSchema = z.object({
	id: z.number(),
	name: z.string(),
	evolution_chain: APIResource,
	generation: NamedAPIResource,
	flavor_text_entries: z.array(
		z.object({
			flavor_text: z.string(),
			language: NamedAPIResource
		})
	)
});

// Evolution chain schema
export const EvolutionChainSchema = z.object({
	id: z.number(),
	chain: z.lazy(() =>
		z.object({
			species: NamedAPIResource,
			evolves_to: z.array(EvolutionDetailSchema)
		})
	)
});

const EvolutionDetailSchema: z.ZodType<any> = z.object({
	species: NamedAPIResource,
	evolves_to: z.array(z.lazy(() => EvolutionDetailSchema))
});

// Type schema
export const TypeSchema = z.object({
	id: z.number(),
	name: z.string(),
	pokemon: z.array(
		z.object({
			pokemon: NamedAPIResource,
			slot: z.number()
		})
	)
});

// Generation schema
export const GenerationSchema = z.object({
	id: z.number(),
	name: z.string(),
	pokemon_species: z.array(NamedAPIResource)
});

// Berry schema
export const BerrySchema = z.object({
	id: z.number(),
	name: z.string(),
	growth_time: z.number(),
	max_harvest: z.number(),
	natural_gift_power: z.number(),
	size: z.number(),
	smoothness: z.number(),
	soil_dryness: z.number(),
	firmness: NamedAPIResource,
	flavors: z.array(
		z.object({
			flavor: NamedAPIResource,
			potency: z.number()
		})
	),
	item: NamedAPIResource
});

// Berry list schema
export const BerryListSchema = z.object({
	count: z.number(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	results: z.array(NamedAPIResource)
});

// Type exports
export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonList = z.infer<typeof PokemonListSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type Type = z.infer<typeof TypeSchema>;
export type Generation = z.infer<typeof GenerationSchema>;
export type Berry = z.infer<typeof BerrySchema>;
export type BerryList = z.infer<typeof BerryListSchema>;
