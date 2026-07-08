<script lang="ts">
	import type { Berry } from '$lib/api/schemas';
	import { formatPokemonName } from '$lib/utils/format';
	import { base } from '$app/paths';
	import { scale } from 'svelte/transition';

	interface Props {
		berry: Berry;
	}

	let { berry }: Props = $props();
</script>

<a
	href="{base}/berries/{berry.name}"
	class="berry-card"
	transition:scale={{ duration: 200 }}
>
	<div class="card-content">
		<h3 class="berry-name">{formatPokemonName(berry.name)}</h3>

		<div class="berry-info">
			<div class="info-item">
				<span class="label">Firmness</span>
				<span class="value">{formatPokemonName(berry.firmness.name)}</span>
			</div>
			<div class="info-item">
				<span class="label">Size</span>
				<span class="value">{berry.size} mm</span>
			</div>
			<div class="info-item">
				<span class="label">Growth Time</span>
				<span class="value">{berry.growth_time}h</span>
			</div>
		</div>

		{#if berry.flavors.length > 0}
			<div class="flavors">
				{#each berry.flavors.filter(f => f.potency > 0) as flavor}
					<span class="flavor-badge">
						{formatPokemonName(flavor.flavor.name)}: {flavor.potency}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</a>

<style>
	.berry-card {
		display: block;
		background: linear-gradient(135deg, #ec4899, #f472b6);
		border-radius: 1rem;
		overflow: hidden;
		transition: transform 0.2s;
		min-height: 220px;
	}

	.berry-card:hover {
		transform: translateY(-4px);
	}

	.card-content {
		padding: 1.5rem;
		color: white;
	}

	.berry-name {
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.berry-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		font-size: 0.875rem;
	}

	.label {
		opacity: 0.9;
	}

	.value {
		font-weight: 600;
	}

	.flavors {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.flavor-badge {
		padding: 0.25rem 0.75rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		backdrop-filter: blur(8px);
	}

	@media (prefers-reduced-motion: reduce) {
		.berry-card {
			transition: none;
		}

		.berry-card:hover {
			transform: none;
		}
	}
</style>
