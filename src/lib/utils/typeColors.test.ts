import { describe, expect, it } from 'vitest';
import { getTypeColor, getTypeGradient } from './typeColors';

describe('getTypeColor', () => {
	it('returns correct color for fire type', () => {
		expect(getTypeColor('fire')).toBe('#EE8130');
	});

	it('returns correct color for water type', () => {
		expect(getTypeColor('water')).toBe('#6390F0');
	});

	it('returns default color for unknown type', () => {
		expect(getTypeColor('unknown')).toBe('#777');
	});
});

describe('getTypeGradient', () => {
	it('returns default gradient for empty array', () => {
		expect(getTypeGradient([])).toBe('linear-gradient(135deg, #777, #999)');
	});

	it('returns single color gradient for one type', () => {
		const gradient = getTypeGradient(['fire']);
		expect(gradient).toContain('#EE8130');
	});

	it('returns two color gradient for dual types', () => {
		const gradient = getTypeGradient(['fire', 'flying']);
		expect(gradient).toContain('#EE8130');
		expect(gradient).toContain('#A98FF3');
	});
});
