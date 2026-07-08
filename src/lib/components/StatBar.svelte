<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		name: string;
		value: number;
		max?: number;
	}

	let { name, value, max = 255 }: Props = $props();

	let animatedValue = $state(0);
	const percentage = (value / max) * 100;

	onMount(() => {
		setTimeout(() => {
			animatedValue = percentage;
		}, 100);
	});

	function getColor(pct: number): string {
		if (pct >= 75) return '#22c55e';
		if (pct >= 50) return '#eab308';
		if (pct >= 25) return '#f97316';
		return '#ef4444';
	}
</script>

<div class="stat-bar">
	<div class="stat-label">
		<span class="font-semibold">{name}</span>
		<span class="text-sm text-gray-600 dark:text-gray-400">{value}</span>
	</div>
	<div class="bar-container">
		<div
			class="bar-fill"
			style="width: {animatedValue}%; background-color: {getColor(percentage)}"
		></div>
	</div>
</div>

<style>
	.stat-bar {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
	}

	.bar-container {
		height: 0.5rem;
		background-color: var(--color-border);
		border-radius: 9999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 9999px;
		transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@media (prefers-reduced-motion: reduce) {
		.bar-fill {
			transition: none;
		}
	}
</style>
