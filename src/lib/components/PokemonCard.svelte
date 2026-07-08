<script lang="ts">
	import { Heart } from '@lucide/svelte';
	import type { Pokemon } from '$lib/api/schemas';
	import { favoritesStore } from '$lib/stores/favorites';
	import { getTypeColor, getTypeGradient } from '$lib/utils/typeColors';
	import { formatPokemonName } from '$lib/utils/format';
	import { base } from '$app/paths';
	import { scale } from 'svelte/transition';

	interface Props {
		pokemon: Pokemon;
	}

	let { pokemon }: Props = $props();

	const types = pokemon.types.map((t) => t.type.name);
	const gradient = getTypeGradient(types);

	function toggleFavorite(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		favoritesStore.toggle(pokemon.name);
	}
</script>

<a
	href="{base}/pokemon/{pokemon.name}"
	class="pokemon-card group block"
	transition:scale={{ duration: 200 }}
>
	<div class="card-inner" style="background: {gradient}">
		<div class="card-content">
			<div class="flex items-start justify-between mb-2">
				<span class="text-sm font-semibold text-white/80">#{pokemon.id.toString().padStart(3, '0')}</span>
				<button
					onclick={toggleFavorite}
					class="favorite-btn"
					aria-label={$favoritesStore.has(pokemon.name) ? 'Remove from favorites' : 'Add to favorites'}
				>
					<Heart
						size={18}
						fill={$favoritesStore.has(pokemon.name) ? 'currentColor' : 'none'}
						class="transition-all"
					/>
				</button>
			</div>

			<img
				src={pokemon.sprites.front_default || ''}
				alt={pokemon.name}
				class="sprite"
				loading="lazy"
			/>

			<h3 class="pokemon-name">{formatPokemonName(pokemon.name)}</h3>

			<div class="flex gap-1 flex-wrap">
				{#each types as type}
					<span class="type-badge" style="background-color: {getTypeColor(type)}">
						{type}
					</span>
				{/each}
			</div>
		</div>
	</div>
</a>

<style>
	.pokemon-card {
		border-radius: 1rem;
		overflow: hidden;
		transition: transform 0.2s;
	}

	.pokemon-card:hover {
		transform: translateY(-4px);
	}

	.card-inner {
		padding: 1.25rem;
		position: relative;
		min-height: 240px;
	}

	.card-content {
		position: relative;
		z-index: 1;
	}

	.sprite {
		width: 120px;
		height: 120px;
		margin: 0 auto;
		display: block;
		image-rendering: pixelated;
	}

	.pokemon-name {
		color: white;
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
		text-align: center;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.type-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		color: white;
		font-weight: 600;
		text-transform: capitalize;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.favorite-btn {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 9999px;
		padding: 0.375rem;
		color: white;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
		backdrop-filter: blur(8px);
	}

	.favorite-btn:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	@media (prefers-reduced-motion: reduce) {
		.pokemon-card {
			transition: none;
		}

		.pokemon-card:hover {
			transform: none;
		}

		.favorite-btn {
			transition: none;
		}

		.favorite-btn:hover {
			transform: none;
		}
	}
</style>
