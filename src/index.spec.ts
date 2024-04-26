import {Filter, OrderBy, OrderByDirection, parseFilter, parseOrderBy} from './index';
import {describe, expect, it} from 'vitest';

describe('parseFilter', () => {
	it('should parse binary operator', () => {
		expect(parseFilter(`Name eq 'Milk'`)).toStrictEqual<Filter>({
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

	it('should parse escaped string', () => {
		expect(parseFilter(`Name eq 'Milk from "McDonald''s farm"'`)).toStrictEqual<Filter>({
			type: 'EqExpr',
			left: {
				type: 'MemberExpr',
				value: 'Name',
			},
			right: {
				type: 'Primitive',
				value: `Milk from "McDonald's farm"`,
			},
		});
	});

	it('should ignore extra whitespace', () => {
		expect(parseFilter(`( (  Name  eq   'Milk'  or  Price  ge  1e-1 )  and  Price  le  3.14e3 )  or ( State  in  [ 1 , null ]  and  Fresh  ne  false )`))
			.toStrictEqual<Filter>(parseFilter(`((Name eq 'Milk' or Price ge 1e-1) and Price le 3.14e3) or (State in [1,null] and Fresh ne false)`));
		expect(parseFilter(`contains(   CompanyName   ,   'Alfreds'   )`))
			.toStrictEqual<Filter>(parseFilter(`contains(CompanyName,'Alfreds')`));
	});

	it('should parse logical conjunction operator', () => {
		expect(parseFilter(`Name gt 'Milk' or Price lt -2.55 or Size ne 3`)).toStrictEqual<Filter>({
			type: 'OrExpr',
			left: {
				type: 'GtExpr',
				left: {
					type: 'MemberExpr',
					value: 'Name',
				},
				right: {
					type: 'Primitive',
					value: 'Milk',
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
						value: -2.55,
					},
				},
				right: {
					type: 'NeExpr',
					left: {
						type: 'MemberExpr',
						value: 'Size',
					},
					right: {
						type: 'Primitive',
						value: 3,
					},
				},
			},
		});
	});

	it('should use parentheses for operation precedence', () => {
		expect(parseFilter(`(Name eq 'Milk' or Price ge 1e-1) and Price le 3.14e3 or State in [1,null] and Fresh ne false`)).toStrictEqual<Filter>({
			type: 'OrExpr',
			left: {
				type: 'AndExpr',
				left: {
					type: 'OrExpr',
					left: {
						type: 'EqExpr',
						left: {
							type: 'MemberExpr',
							value: 'Name',
						},
						right: {
							type: 'Primitive',
							value: 'Milk',
						},
					},
					right: {
						type: 'GeExpr',
						left: {
							type: 'MemberExpr',
							value: 'Price',
						},
						right: {
							type: 'Primitive',
							value: 1e-1,
						},
					},
				},
				right: {
					type: 'LeExpr',
					left: {
						type: 'MemberExpr',
						value: 'Price',
					},
					right: {
						type: 'Primitive',
						value: 3.14e3,
					},
				},
			},
			right: {
				type: 'AndExpr',
				left: {
					type: 'InExpr',
					left: {
						type: 'MemberExpr',
						value: 'State',
					},
					right: {
						type: 'ArrayExpr',
						value: [
							{type: 'Primitive', value: 1},
							{type: 'Primitive', value: null},
						],
					},
				},
				right: {
					type: 'NeExpr',
					left: {
						type: 'MemberExpr',
						value: 'Fresh',
					},
					right: {
						type: 'Primitive',
						value: false,
					},
				},
			},
		});
	});

	it('should parse string function', () => {
		expect(parseFilter(`contains(CompanyName,'Alfreds')`)).toStrictEqual<Filter>({
			type: 'FunctionExpr',
			name: 'contains',
			arguments: [
				{
					type: 'MemberExpr',
					value: 'CompanyName',
				},
				{
					type: 'Primitive',
					value: 'Alfreds',
				},
			],
		});
	});
});

describe('parseOrderBy', () => {
	it('should parse single clause', () => {
		expect(parseOrderBy('age asc')).toStrictEqual<OrderBy>([
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'age',
				},
				dir: OrderByDirection.ASC,
			},
		]);
		expect(parseOrderBy('age desc')).toStrictEqual<OrderBy>([
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'age',
				},
				dir: OrderByDirection.DESC,
			},
		]);
		expect(parseOrderBy('age')).toStrictEqual<OrderBy>([
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'age',
				},
				dir: OrderByDirection.ASC,
			},
		]);
	});

	it('should parse mupliple clauses', () => {
		expect(parseOrderBy('age asc,name asc')).toStrictEqual<OrderBy>([
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'age',
				},
				dir: OrderByDirection.ASC,
			},
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'name',
				},
				dir: OrderByDirection.ASC,
			},
		]);
		expect(parseOrderBy('age desc,name,size desc')).toStrictEqual<OrderBy>([
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'age',
				},
				dir: OrderByDirection.DESC,
			},
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'name',
				},
				dir: OrderByDirection.ASC,
			},
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'size',
				},
				dir: OrderByDirection.DESC,
			},
		]);
		expect(parseOrderBy('age,name,size desc,friendliness')).toStrictEqual<OrderBy>([
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'age',
				},
				dir: OrderByDirection.ASC,
			},
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'name',
				},
				dir: OrderByDirection.ASC,
			},
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'size',
				},
				dir: OrderByDirection.DESC,
			},
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'friendliness',
				},
				dir: OrderByDirection.ASC,
			},
		]);
	});

	it('should parse function', () => {
		expect(parseOrderBy('age,sum(height,width) desc')).toStrictEqual<OrderBy>([
			{
				type: 'OrderByItem',
				expr: {
					type: 'MemberExpr',
					value: 'age',
				},
				dir: OrderByDirection.ASC,
			},
			{
				type: 'OrderByItem',
				expr: {
					type: 'FunctionExpr',
					name: 'sum',
					arguments: [
						{
							type: 'MemberExpr',
							value: 'height',
						},
						{
							type: 'MemberExpr',
							value: 'width',
						},
					],
				},
				dir: OrderByDirection.DESC,
			},
		]);
	});

	it('should ignore extra whitespace', () => {
		expect(parseOrderBy('age,name,size desc,friendliness,sum(height,width) asc'))
			.toStrictEqual<OrderBy>(parseOrderBy('age  ,   name   ,    size    desc   ,   friendliness   ,   sum(   height   ,   width   )   asc'));
	});
});
