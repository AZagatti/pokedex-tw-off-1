<script lang="ts">
	import { onMount } from 'svelte';
	import { favoritesStore } from '$lib/stores/favorites';
	import { fetchPokemon } from '$lib/api/client';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import type { Pokemon } from '$lib/api/schemas';

	let favoritePokemon = $state<Pokemon[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const favorites = Array.from($favoritesStore);

		if (favorites.length === 0) {
			loading = false;
			return;
		}

		try {
			const pokemonPromises = favorites.map((name) => fetchPokemon(name));
			const results = await Promise.all(pokemonPromises);
			favoritePokemon = results.filter((p): p is Pokemon => p !== null);
		} catch (error) {
			console.error('Failed to load favorites:', error);
		} finally {
			loading = false;
		}
	});

	$effect(() => {
		// Reload when favorites change
		const favorites = Array.from($favoritesStore);
		if (!loading && favoritePokemon.length !== favorites.length) {
			favoritePokemon = favoritePokemon.filter((p) => $favoritesStore.has(p.name));
		}
	});
</script>

<svelte:head>
	<title>My Favorites - Pokédex</title>
	<meta name="description" content="Your favorite Pokémon collection" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-8">My Favorites</h1>

	{#if loading}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			{#each Array(5) as _}
				<div class="skeleton-card"></div>
			{/each}
		</div>
	{:else if favoritePokemon.length === 0}
		<div class="empty-state">
			<p class="text-xl text-gray-500 mb-4">You haven't added any favorites yet</p>
			<p class="text-gray-400">Click the heart icon on any Pokémon card to add it to your favorites</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			{#each favoritePokemon as pokemon (pokemon.id)}
				<PokemonCard {pokemon} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
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
