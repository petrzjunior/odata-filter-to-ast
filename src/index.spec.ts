import {Expression, parseFilter} from './index';
import {describe, expect, it} from 'vitest';

describe('parseFilter', () => {
	it('should parse binary operator', () => {
		expect(parseFilter(`Name eq "Milk"`)).toStrictEqual<Expression>({
			type: 'eqExpr',
			left: {
				type: 'memberExpr',
				value: 'Name',
			},
			right: {
				type: 'primitive',
				value: 'Milk',
			},
		});
	});

	it('should parse logical conjunction operator', () => {
		expect(parseFilter(`Name gt "Milk" or Price lt -2.55 or Size ne 3`)).toStrictEqual<Expression>({
			type: 'orExpr',
			left: {
				type: 'gtExpr',
				left: {
					type: 'memberExpr',
					value: 'Name',
				},
				right: {
					type: 'primitive',
					value: 'Milk'
				},
			},
			right: {
				type: 'orExpr',
				left: {
					type: 'ltExpr',
					left: {
						type: 'memberExpr',
						value: 'Price',
					},
					right: {
						type: 'primitive',
						value: -2.55
					}
				},
				right:  {
					type: 'neExpr',
					left: {
						type: 'memberExpr',
						value: 'Size',
					},
					right: {
						type: 'primitive',
						value: 3
					}
				}
			}
		});
	});

	it('should use parentheses for operation precedence', () => {
		expect(parseFilter(`(Name eq "Milk" or Price ge 1e-1) and Price le 3.14e3 or State in [1,null]`)).toStrictEqual<Expression>({
			type: 'orExpr',
			left: {
				type: 'andExpr',
				left: {
					type: 'orExpr',
					left: {
						type: 'eqExpr',
						left: {
							type: 'memberExpr',
							value: 'Name',
						},
						right: {
							type: 'primitive',
							value: 'Milk'
						},
					},
					right: {
						type: 'geExpr',
						left: {
							type: 'memberExpr',
							value: 'Price',
						},
						right: {
							type: 'primitive',
							value: 1e-1
						}
					}
				},
				right: {
					type: 'leExpr',
					left: {
						type: 'memberExpr',
						value: 'Price',
					},
					right: {
						type: 'primitive',
						value: 3.14e3,
					}
				}
			},
			right: {
				type: 'inExpr',
				left: {
					type: 'memberExpr',
					value: 'State',
				},
				right: {
					type: 'arrayExpr',
					value: [
						{type: 'primitive', value: 1},
						{type: 'primitive', value: null},
					],
				},
			}
		});
	});

	it('should parse string function', () => {
		expect(parseFilter(`contains(CompanyName,"Alfreds")`)).toStrictEqual<Expression>({
			type: 'functionExpr',
			name: 'contains',
			arguments: [
				{
					type: 'memberExpr',
					value: 'CompanyName',
				},
				{
					type: 'primitive',
					value: 'Alfreds',
				},
			],
		});
	});
});
