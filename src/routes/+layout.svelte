<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeStore } from '$lib/stores/theme';
	import { favoritesStore } from '$lib/stores/favorites';
	import Header from '$lib/components/Header.svelte';

	const { children } = $props();

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		themeStore.set(savedTheme as 'light' | 'dark');
		document.documentElement.dataset.theme = savedTheme;

		favoritesStore.load();
	});

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.dataset.theme = $themeStore;
			localStorage.setItem('theme', $themeStore);
		}
	});
</script>

<div class="min-h-screen flex flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
