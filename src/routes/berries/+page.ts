import { fetchBerry, fetchBerryList } from '$lib/api/client';
import type { Berry } from '$lib/api/schemas';

export const prerender = true;

export async function load() {
	const berryList = await fetchBerryList(30, 0);

	const berryDetails = await Promise.all(
		berryList.results.slice(0, 30).map(async (b) => {
			try {
				return await fetchBerry(b.name);
			} catch {
				return null;
			}
		})
	);

	const validBerries = berryDetails.filter((b): b is Berry => b !== null);

	return {
		initialBerries: validBerries,
		total: berryList.count
	};
}
