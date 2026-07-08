<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { themeStore } from '$lib/stores/theme';
	import { base } from '$app/paths';

	function toggleTheme() {
		themeStore.update((current) => (current === 'light' ? 'dark' : 'light'));
	}
</script>

<header class="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
	<nav class="container mx-auto flex items-center justify-between px-4 py-4">
		<a href="{base}/" class="flex items-center gap-2 text-xl font-bold">
			<span class="text-2xl">⚡</span>
			<span>Pokédex</span>
		</a>

		<div class="flex items-center gap-6">
			<a href="{base}/" class="hover:text-blue-600 transition-colors">Pokémon</a>
			<a href="{base}/berries" class="hover:text-blue-600 transition-colors">Berries</a>
			<a href="{base}/favorites" class="hover:text-blue-600 transition-colors">Favorites</a>

			<button
				onclick={toggleTheme}
				class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				aria-label="Toggle theme"
			>
				{#if $themeStore === 'light'}
					<Moon size={20} />
				{:else}
					<Sun size={20} />
				{/if}
			</button>
		</div>
	</nav>
</header>

<style>
	header {
		border-color: var(--color-border);
	}

	.dark\:bg-gray-900\/90 {
		background-color: rgb(17 24 39 / 0.9);
	}

	.dark\:hover\:bg-gray-800:hover {
		background-color: rgb(31 41 55);
	}

	@media (prefers-color-scheme: dark) {
		[data-theme='dark'] header {
			background-color: rgb(17 24 39 / 0.9);
		}
	}
</style>
