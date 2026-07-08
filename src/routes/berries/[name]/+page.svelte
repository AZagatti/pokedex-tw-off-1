<script lang="ts">
	import { ArrowLeft } from '@lucide/svelte';
	import { base } from '$app/paths';
	import { formatPokemonName } from '$lib/utils/format';
	import { fade } from 'svelte/transition';
	import type { Berry } from '$lib/api/schemas';

	interface Props {
		data: {
			berry: Berry;
		};
	}

	let { data }: Props = $props();
	const { berry } = data;
</script>

<svelte:head>
	<title>{formatPokemonName(berry.name)} Berry - Pokédex</title>
</svelte:head>

<div class="min-h-screen">
	<div class="hero-section">
		<div class="container mx-auto px-4 py-8">
			<a href="{base}/berries" class="back-button">
				<ArrowLeft size={20} />
				<span>Back to Berries</span>
			</a>

			<div class="hero-content" in:fade={{ duration: 300 }}>
				<h1 class="text-5xl font-bold text-white mb-4">{formatPokemonName(berry.name)} Berry</h1>
			</div>
		</div>
	</div>

	<div class="container mx-auto px-4 py-8">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<section class="card">
				<h2 class="section-title">Information</h2>
				<div class="info-grid">
					<div>
						<p class="label">Firmness</p>
						<p class="value">{formatPokemonName(berry.firmness.name)}</p>
					</div>
					<div>
						<p class="label">Size</p>
						<p class="value">{berry.size} mm</p>
					</div>
					<div>
						<p class="label">Growth Time</p>
						<p class="value">{berry.growth_time} hours</p>
					</div>
					<div>
						<p class="label">Max Harvest</p>
						<p class="value">{berry.max_harvest}</p>
					</div>
					<div>
						<p class="label">Smoothness</p>
						<p class="value">{berry.smoothness}</p>
					</div>
					<div>
						<p class="label">Soil Dryness</p>
						<p class="value">{berry.soil_dryness}</p>
					</div>
				</div>
			</section>

			<section class="card">
				<h2 class="section-title">Flavors</h2>
				<div class="flavors-list">
					{#each berry.flavors.filter(f => f.potency > 0) as flavor}
						<div class="flavor-item">
							<span class="flavor-name">{formatPokemonName(flavor.flavor.name)}</span>
							<div class="flavor-bar-container">
								<div class="flavor-bar" style="width: {(flavor.potency / 40) * 100}%"></div>
							</div>
							<span class="flavor-value">{flavor.potency}</span>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.hero-section {
		background: linear-gradient(135deg, #ec4899, #f472b6);
		padding: 2rem 0;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border-radius: 9999px;
		font-weight: 600;
		backdrop-filter: blur(8px);
		transition: all 0.2s;
		margin-bottom: 2rem;
	}

	.back-button:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.hero-content {
		text-align: center;
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

	.info-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.label {
		font-size: 0.875rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.value {
		font-size: 1.125rem;
		font-weight: 600;
	}

	.flavors-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.flavor-item {
		display: grid;
		grid-template-columns: 100px 1fr 50px;
		align-items: center;
		gap: 1rem;
	}

	.flavor-name {
		font-weight: 600;
		text-transform: capitalize;
	}

	.flavor-bar-container {
		height: 0.75rem;
		background: var(--color-border);
		border-radius: 9999px;
		overflow: hidden;
	}

	.flavor-bar {
		height: 100%;
		background: linear-gradient(90deg, #ec4899, #f472b6);
		border-radius: 9999px;
		transition: width 0.5s;
	}

	.flavor-value {
		text-align: right;
		font-weight: 600;
		color: #6b7280;
	}
</style>
