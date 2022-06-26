import {parseFilter} from './index';
import {describe, expect, it} from 'vitest';

describe('parseFilter', () => {
	it('should parse', () => {
		expect(parseFilter('aaa')).toBe('aaa');
	});
});