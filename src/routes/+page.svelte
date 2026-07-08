<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, X } from '@lucide/svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import { fetchPokemon, fetchPokemonList, POKEMON_TYPES, fetchType, fetchGeneration } from '$lib/api/client';
	import type { Pokemon } from '$lib/api/schemas';
	import { formatPokemonName } from '$lib/utils/format';

	interface Props {
		data: {
			initialPokemon: Pokemon[];
			total: number;
		};
	}

	let { data }: Props = $props();

	let allPokemon = $state<Pokemon[]>(data.initialPokemon);
	let filteredPokemon = $state<Pokemon[]>(data.initialPokemon);
	let loading = $state(false);
	let hasMore = $state(true);
	let offset = $state(30);

	let searchQuery = $state('');
	let selectedTypes = $state<Set<string>>(new Set());
	let selectedGeneration = $state<number | null>(null);
	let sortBy = $state<'id' | 'total'>('id');

	let searchTimeout: ReturnType<typeof setTimeout> | null = null;
	let observer: IntersectionObserver | null = null;
	let sentinel: HTMLElement | null = null;

	async function loadMore() {
		if (loading || !hasMore || selectedGeneration || selectedTypes.size > 0) return;

		loading = true;
		try {
			const list = await fetchPokemonList(30, offset);
			const newPokemon = await Promise.all(
				list.results.map(async (p) => {
					try {
						return await fetchPokemon(p.name);
					} catch {
						return null;
					}
				})
			);

			const valid = newPokemon.filter((p): p is Pokemon => p !== null);
			allPokemon = [...allPokemon, ...valid];
			offset += 30;

			if (!list.next) {
				hasMore = false;
			}
		} catch (error) {
			console.error('Failed to load more Pokemon:', error);
		} finally {
			loading = false;
		}
	}

	function applyFilters() {
		let result = [...allPokemon];

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter((p) => p.name.toLowerCase().includes(query));
		}

		if (selectedTypes.size > 0) {
			result = result.filter((p) => {
				const pokemonTypes = p.types.map((t) => t.type.name);
				return Array.from(selectedTypes).every((type) => pokemonTypes.includes(type));
			});
		}

		if (sortBy === 'total') {
			result.sort((a, b) => {
				const totalA = a.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
				const totalB = b.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
				return totalB - totalA;
			});
		} else {
			result.sort((a, b) => a.id - b.id);
		}

		filteredPokemon = result;
	}

	function handleSearch(e: Event) {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value;

		if (searchTimeout) clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			applyFilters();
		}, 250);
	}

	function toggleType(type: string) {
		const newTypes = new Set(selectedTypes);
		if (newTypes.has(type)) {
			newTypes.delete(type);
		} else {
			newTypes.add(type);
		}
		selectedTypes = newTypes;
		applyFilters();
	}

	async function handleGenerationChange(gen: number | null) {
		selectedGeneration = gen;
		if (gen === null) {
			applyFilters();
			return;
		}

		loading = true;
		try {
			const generation = await fetchGeneration(gen);
			const pokemonDetails = await Promise.all(
				generation.pokemon_species.map(async (p) => {
					try {
						return await fetchPokemon(p.name);
					} catch {
						return null;
					}
				})
			);
			allPokemon = pokemonDetails.filter((p): p is Pokemon => p !== null);
			applyFilters();
		} catch (error) {
			console.error('Failed to load generation:', error);
		} finally {
			loading = false;
		}
	}

	function clearFilters() {
		searchQuery = '';
		selectedTypes = new Set();
		selectedGeneration = null;
		allPokemon = data.initialPokemon;
		offset = 30;
		hasMore = true;
		applyFilters();
	}

	$effect(() => {
		applyFilters();
	});

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMore();
				}
			},
			{ rootMargin: '100px' }
		);

		if (sentinel) {
			observer.observe(sentinel);
		}

		return () => {
			if (observer) observer.disconnect();
		};
	});
</script>

<svelte:head>
	<title>Pokédex - Explore All Pokémon</title>
	<meta name="description" content="Browse and search through all Pokémon with filters by type, generation, and more" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-8 text-center">Pokédex</h1>

	<div class="sticky top-16 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm pb-4 mb-6 -mx-4 px-4">
		<div class="flex flex-col gap-4">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
				<input
					type="text"
					placeholder="Search Pokémon..."
					value={searchQuery}
					oninput={handleSearch}
					class="w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="flex flex-wrap gap-2 items-center">
				<span class="text-sm font-semibold">Generation:</span>
				<button
					onclick={() => handleGenerationChange(null)}
					class="filter-chip"
					class:active={selectedGeneration === null}
				>
					All
				</button>
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as gen}
					<button
						onclick={() => handleGenerationChange(gen)}
						class="filter-chip"
						class:active={selectedGeneration === gen}
					>
						Gen {gen}
					</button>
				{/each}
			</div>

			<div class="flex flex-wrap gap-2 items-center">
				<span class="text-sm font-semibold">Type:</span>
				{#each POKEMON_TYPES as type}
					<button
						onclick={() => toggleType(type)}
						class="filter-chip"
						class:active={selectedTypes.has(type)}
					>
						{formatPokemonName(type)}
					</button>
				{/each}
			</div>

			<div class="flex flex-wrap gap-4 items-center justify-between">
				<div class="flex gap-2 items-center">
					<span class="text-sm font-semibold">Sort:</span>
					<button
						onclick={() => { sortBy = 'id'; applyFilters(); }}
						class="filter-chip"
						class:active={sortBy === 'id'}
					>
						Dex #
					</button>
					<button
						onclick={() => { sortBy = 'total'; applyFilters(); }}
						class="filter-chip"
						class:active={sortBy === 'total'}
					>
						Base Stats
					</button>
				</div>

				{#if searchQuery || selectedTypes.size > 0 || selectedGeneration !== null}
					<button onclick={clearFilters} class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
						<X size={16} />
						Clear filters
					</button>
				{/if}
			</div>
		</div>
	</div>

	{#if filteredPokemon.length === 0}
		<div class="text-center py-16">
			<p class="text-xl text-gray-500">No Pokémon found</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			{#each filteredPokemon as pokemon (pokemon.id)}
				<PokemonCard {pokemon} />
			{/each}
		</div>

		{#if loading}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
				{#each Array(5) as _}
					<div class="skeleton-card"></div>
				{/each}
			</div>
		{/if}
	{/if}

	<div bind:this={sentinel} class="h-10"></div>
</div>

<style>
	.filter-chip {
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		border: 1px solid var(--color-border);
		background: transparent;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-chip:hover {
		background: rgba(59, 130, 246, 0.1);
		border-color: rgb(59, 130, 246);
	}

	.filter-chip.active {
		background: rgb(59, 130, 246);
		color: white;
		border-color: rgb(59, 130, 246);
	}

	.skeleton-card {
		height: 240px;
		border-radius: 1rem;
		background: linear-gradient(90deg, var(--color-card) 0%, var(--color-border) 50%, var(--color-card) 100%);
		background-size: 200% 100%;
		animation: shimmer 1.5s infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton-card {
			animation: none;
		}
	}
</style>
