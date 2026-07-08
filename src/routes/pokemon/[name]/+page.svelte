<script lang="ts">
	import { ArrowLeft, Heart, Volume2 } from '@lucide/svelte';
	import { base } from '$app/paths';
	import { favoritesStore } from '$lib/stores/favorites';
	import { getTypeColor, getTypeGradient } from '$lib/utils/typeColors';
	import { formatPokemonName, formatStatName } from '$lib/utils/format';
	import StatBar from '$lib/components/StatBar.svelte';
	import { scale, fade } from 'svelte/transition';
	import type { EvolutionChain } from '$lib/api/schemas';

	interface Props {
		data: {
			pokemon: any;
			evolutionChain: EvolutionChain | null;
		};
	}

	let { data }: Props = $props();
	const { pokemon, evolutionChain } = data;

	const types = pokemon.types.map((t: any) => t.type.name);
	const gradient = getTypeGradient(types);

	let selectedSprite = $state<'front' | 'back' | 'shiny-front' | 'shiny-back'>('front');
	let audioPlaying = $state(false);

	const sprites = {
		front: pokemon.sprites.front_default,
		back: pokemon.sprites.back_default,
		'shiny-front': pokemon.sprites.front_shiny,
		'shiny-back': pokemon.sprites.back_shiny
	};

	function getEvolutionNames(chain: EvolutionChain): string[] {
		const names: string[] = [];

		function traverse(node: any): void {
			names.push(node.species.name);
			if (node.evolves_to && node.evolves_to.length > 0) {
				node.evolves_to.forEach(traverse);
			}
		}

		traverse(chain.chain);
		return names;
	}

	const evolutionNames = evolutionChain ? getEvolutionNames(evolutionChain) : [];

	function toggleFavorite() {
		favoritesStore.toggle(pokemon.name);
	}

	function playCry() {
		if (!pokemon.cries?.latest && !pokemon.cries?.legacy) return;

		const audio = new Audio(pokemon.cries.latest || pokemon.cries.legacy);
		audioPlaying = true;

		audio.play();
		audio.onended = () => {
			audioPlaying = false;
		};
	}
</script>

<svelte:head>
	<title>{formatPokemonName(pokemon.name)} - Pokédex</title>
	<meta name="description" content="View detailed information about {formatPokemonName(pokemon.name)}" />
</svelte:head>

<div class="min-h-screen">
	<div class="hero-section" style="background: {gradient}">
		<div class="container mx-auto px-4 py-8">
			<div class="flex items-center justify-between mb-6">
				<a href="{base}/" class="back-button">
					<ArrowLeft size={20} />
					<span>Back</span>
				</a>

				<button
					onclick={toggleFavorite}
					class="favorite-btn-large"
					aria-label={$favoritesStore.has(pokemon.name) ? 'Remove from favorites' : 'Add to favorites'}
				>
					<Heart
						size={24}
						fill={$favoritesStore.has(pokemon.name) ? 'currentColor' : 'none'}
					/>
				</button>
			</div>

			<div class="hero-content" in:fade={{ duration: 300 }}>
				<div class="text-center">
					<p class="text-white/80 text-lg font-semibold mb-2">#{pokemon.id.toString().padStart(3, '0')}</p>
					<h1 class="text-5xl font-bold text-white mb-4">{formatPokemonName(pokemon.name)}</h1>

					<div class="flex gap-2 justify-center mb-6">
						{#each types as type}
							<span class="type-badge-large" style="background-color: {getTypeColor(type)}">
								{formatPokemonName(type)}
							</span>
						{/each}
					</div>

					<div class="artwork-container" in:scale={{ duration: 400, start: 0.8 }}>
						<img
							src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
							alt={pokemon.name}
							class="artwork"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<section class="card">
				<h2 class="section-title">About</h2>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<p class="label">Height</p>
						<p class="value">{(pokemon.height / 10).toFixed(1)} m</p>
					</div>
					<div>
						<p class="label">Weight</p>
						<p class="value">{(pokemon.weight / 10).toFixed(1)} kg</p>
					</div>
				</div>

				{#if pokemon.cries?.latest || pokemon.cries?.legacy}
					<button onclick={playCry} class="cry-button" disabled={audioPlaying}>
						<Volume2 size={20} />
						<span>{audioPlaying ? 'Playing...' : 'Play Cry'}</span>
					</button>
				{/if}
			</section>

			<section class="card">
				<h2 class="section-title">Abilities</h2>
				<div class="flex flex-wrap gap-2">
					{#each pokemon.abilities as ability}
						<span class="ability-badge" class:hidden={ability.is_hidden}>
							{formatPokemonName(ability.ability.name)}
							{#if ability.is_hidden}
								<span class="text-xs opacity-70">(Hidden)</span>
							{/if}
						</span>
					{/each}
				</div>
			</section>
		</div>

		<section class="card mt-8">
			<h2 class="section-title">Base Stats</h2>
			<div class="space-y-3">
				{#each pokemon.stats as stat}
					<StatBar name={formatStatName(stat.stat.name)} value={stat.base_stat} />
				{/each}
				<StatBar
					name="Total"
					value={pokemon.stats.reduce((sum: number, s: any) => sum + s.base_stat, 0)}
					max={720}
				/>
			</div>
		</section>

		<section class="card mt-8">
			<h2 class="section-title">Sprite Variants</h2>
			<div class="flex gap-2 mb-4 flex-wrap">
				<button
					onclick={() => (selectedSprite = 'front')}
					class="sprite-toggle"
					class:active={selectedSprite === 'front'}
				>
					Front
				</button>
				<button
					onclick={() => (selectedSprite = 'back')}
					class="sprite-toggle"
					class:active={selectedSprite === 'back'}
				>
					Back
				</button>
				<button
					onclick={() => (selectedSprite = 'shiny-front')}
					class="sprite-toggle"
					class:active={selectedSprite === 'shiny-front'}
				>
					Shiny Front
				</button>
				<button
					onclick={() => (selectedSprite = 'shiny-back')}
					class="sprite-toggle"
					class:active={selectedSprite === 'shiny-back'}
				>
					Shiny Back
				</button>
			</div>
			<div class="sprite-display">
				{#key selectedSprite}
					<img
						src={sprites[selectedSprite]}
						alt="{pokemon.name} {selectedSprite}"
						class="sprite-large"
						in:scale={{ duration: 200 }}
					/>
				{/key}
			</div>
		</section>

		{#if evolutionNames.length > 1}
			<section class="card mt-8">
				<h2 class="section-title">Evolution Chain</h2>
				<div class="flex flex-wrap gap-4 items-center">
					{#each evolutionNames as name, i}
						<a href="{base}/pokemon/{name}" class="evolution-link">
							{formatPokemonName(name)}
						</a>
						{#if i < evolutionNames.length - 1}
							<span class="text-2xl text-gray-400">→</span>
						{/if}
					{/each}
				</div>
			</section>
		{/if}

		<section class="card mt-8">
			<h2 class="section-title">Example Moves</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
				{#each pokemon.moves.slice(0, 8) as move}
					<span class="move-badge">
						{formatPokemonName(move.move.name)}
					</span>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	.hero-section {
		position: relative;
		padding: 2rem 0;
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}

	.back-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border-radius: 9999px;
		font-weight: 600;
		backdrop-filter: blur(8px);
		transition: all 0.2s;
	}

	.back-button:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateX(-4px);
	}

	.favorite-btn-large {
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 9999px;
		color: white;
		border: none;
		cursor: pointer;
		backdrop-filter: blur(8px);
		transition: all 0.2s;
	}

	.favorite-btn-large:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.type-badge-large {
		padding: 0.5rem 1.5rem;
		border-radius: 9999px;
		color: white;
		font-weight: 600;
		text-transform: capitalize;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.artwork-container {
		margin: 2rem auto;
		max-width: 400px;
	}

	.artwork {
		width: 100%;
		height: auto;
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
	}

	.card {
		background: var(--color-card);
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
	}

	.label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.value {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.cry-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: rgb(59, 130, 246);
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		margin-top: 1rem;
		transition: all 0.2s;
	}

	.cry-button:hover:not(:disabled) {
		background: rgb(37, 99, 235);
	}

	.cry-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ability-badge {
		padding: 0.5rem 1rem;
		background: var(--color-border);
		border-radius: 0.5rem;
		font-weight: 500;
	}

	.ability-badge.hidden {
		background: #fbbf24;
		color: white;
	}

	.sprite-toggle {
		padding: 0.5rem 1rem;
		border: 1px solid var(--color-border);
		background: transparent;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.sprite-toggle:hover {
		background: rgba(59, 130, 246, 0.1);
		border-color: rgb(59, 130, 246);
	}

	.sprite-toggle.active {
		background: rgb(59, 130, 246);
		color: white;
		border-color: rgb(59, 130, 246);
	}

	.sprite-display {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		background: var(--color-bg);
		border-radius: 0.5rem;
		min-height: 200px;
	}

	.sprite-large {
		width: 150px;
		height: 150px;
		image-rendering: pixelated;
	}

	.evolution-link {
		padding: 0.75rem 1.5rem;
		background: var(--color-border);
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.evolution-link:hover {
		background: rgb(59, 130, 246);
		color: white;
	}

	.move-badge {
		padding: 0.5rem 1rem;
		background: var(--color-border);
		border-radius: 0.5rem;
		font-size: 0.875rem;
		text-align: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.back-button:hover {
			transform: none;
		}

		.favorite-btn-large:hover {
			transform: none;
		}
	}
</style>
