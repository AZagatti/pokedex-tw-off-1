<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { themeStore } from '$lib/stores/theme';

	const { children } = $props();

	onMount(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		themeStore.set(savedTheme as 'light' | 'dark');
		document.documentElement.dataset.theme = savedTheme;
	});

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.dataset.theme = $themeStore;
			localStorage.setItem('theme', $themeStore);
		}
	});
</script>

{@render children()}
