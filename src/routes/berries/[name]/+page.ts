import { error } from '@sveltejs/kit';
import { fetchBerry } from '$lib/api/client';

export const prerender = false;

export async function load({ params }) {
	try {
		const berry = await fetchBerry(params.name);
		return { berry };
	} catch (err) {
		throw error(404, 'Berry not found');
	}
}
