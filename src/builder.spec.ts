import { ODataFilterBuilder } from 'odata-filter-builder';
import { describe, expect, it } from 'vitest';
import { Filter, parseFilter } from './index.js';


describe('filter', () => {
	it('should parse binary operator', () => {
		expect(parseFilter(
			ODataFilterBuilder()
				.eq('Name', 'Milk')
				.toString()
		)).toStrictEqual<Filter>({
			type: 'EqExpr',
			left: {
				type: 'MemberExpr',
				value: 'Name',
			},
			right: {
				type: 'Primitive',
				value: 'Milk',
			},
		});
	});

	it('should parse logical conjunction operator', () => {
		expect(parseFilter(ODataFilterBuilder.or()
			.gt('Name', 'Milk')
			.lt('Price', -2.55)
			.ne('Size', 3)
			.toString()
		)).toStrictEqual<Filter>({
			type: 'OrExpr',
			left: {
				type: 'GtExpr',
				left: {
					type: 'MemberExpr',
					value: 'Name',
				},
				right: {
					type: 'Primitive',
					value: 'Milk'
				},
			},
			right: {
				type: 'OrExpr',
				left: {
					type: 'LtExpr',
					left: {
						type: 'MemberExpr',
						value: 'Price',
					},
					right: {
						type: 'Primitive',
						value: -2.55
					}
				},
				right: {
					type: 'NeExpr',
					left: {
						type: 'MemberExpr',
						value: 'Size',
					},
					right: {
						type: 'Primitive',
						value: 3
					}
				}
			}
		});
	});

	it('should parse odata-filter-builder or + and', () => {
		expect(parseFilter(ODataFilterBuilder.or()
			.contains(x => x.toLower('Name'), 'google')
			.contains(x => x.toLower('Name'), 'yandex')
			.and(x => x.eq(x => x.toLower('Name'), 'Search Engine'))
			.toString()
		)).toStrictEqual<Filter>({
			type: 'AndExpr',
			left: {
				type: 'OrExpr',
				left: {
					type: 'FunctionExpr',
					name: 'contains',
					arguments: [
						{
							type: 'FunctionExpr',
							name: 'tolower',
							arguments: [
								{
									type: 'MemberExpr',
									value: 'Name',
								}
							]
						},
						{
							type: 'Primitive',
							value: 'google'
						}
					]
				},
				right: {
					type: 'FunctionExpr',
					name: 'contains',
					arguments: [
						{
							type: 'FunctionExpr',
							name: 'tolower',
							arguments: [
								{
									type: 'MemberExpr',
									value: 'Name',
								}
							]
						},
						{
							type: 'Primitive',
							value: 'yandex'
						}
					]
				}
			},
			right: {
				type: 'EqExpr',
				left: {
					type: 'FunctionExpr',
					name: 'tolower',
					arguments: [{
						type: 'MemberExpr',
						value: 'Name',
					}]
				},
				right: {
					type: 'Primitive',
					value: 'Search Engine'
				}
			}
		});
	});
});
