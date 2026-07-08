import { describe, expect, it, beforeEach } from 'vitest';
import { getCached, setCached, clearCache } from './cache';

describe('cache', () => {
	beforeEach(() => {
		clearCache();
	});

	it('returns undefined for uncached key', () => {
		expect(getCached('test-key')).toBeUndefined();
	});

	it('stores and retrieves values', () => {
		const testData = { id: 1, name: 'test' };
		setCached('test-key', testData);
		expect(getCached('test-key')).toEqual(testData);
	});

	it('clears all cached values', () => {
		setCached('key1', 'value1');
		setCached('key2', 'value2');
		clearCache();
		expect(getCached('key1')).toBeUndefined();
		expect(getCached('key2')).toBeUndefined();
	});

	it('handles different data types', () => {
		setCached('string', 'hello');
		setCached('number', 42);
		setCached('boolean', true);
		setCached('array', [1, 2, 3]);

		expect(getCached('string')).toBe('hello');
		expect(getCached('number')).toBe(42);
		expect(getCached('boolean')).toBe(true);
		expect(getCached('array')).toEqual([1, 2, 3]);
	});
});
