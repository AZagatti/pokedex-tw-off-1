<script lang="ts">
	import BerryCard from '$lib/components/BerryCard.svelte';
	import type { Berry } from '$lib/api/schemas';

	interface Props {
		data: {
			initialBerries: Berry[];
			total: number;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Berries - Pokédex</title>
	<meta name="description" content="Explore all berries from the Pokémon world" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-4xl font-bold mb-8">Berries</h1>

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
		{#each data.initialBerries as berry (berry.id)}
			<BerryCard {berry} />
		{/each}
	</div>
</div>
