<script lang="ts">
	import { onMount } from 'svelte';

	let message = $state('Loading SvelteKit...');

	onMount(() => {
		message = 'SvelteKit is ready!';
	});
</script>

<div class="container mx-auto p-8">
	<h1 class="text-4xl font-bold">{message}</h1>
	<p class="mt-4">Pokédex scaffold in progress...</p>
</div>
