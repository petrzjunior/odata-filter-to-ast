import {parse as filterParser} from './odata-grammar-filter.js';
import {parse as orderByParser} from './odata-grammar-order-by.js';

export type OdataIdentifier = string;

export type LeftExpr = MemberExpr | FunctionExpr;

export type RightExpr = Primitive;

export type PrimaryExpr = LeftExpr | RightExpr;

export interface UnaryExpr {
	type: string;
	value: unknown;
}

export interface Primitive extends UnaryExpr {
	type: 'Primitive';
	value: string | number | boolean | null;
}

export interface BinaryExpr {
	type: string;
	left: unknown;
	right: unknown;
}

export interface MemberExpr extends UnaryExpr {
	type: 'MemberExpr';
	value: OdataIdentifier;
}

export interface FunctionExpr {
	type: 'FunctionExpr';
	name: string;
	arguments: PrimaryExpr[];
}

export interface InExpr extends BinaryExpr {
	type: 'InExpr';
	left: LeftExpr;
	right: ArrayExpr;
}

export interface EqExpr extends BinaryExpr {
	type: 'EqExpr';
	left: LeftExpr;
	right: RightExpr;
}

export interface NeExpr extends BinaryExpr {
	type: 'NeExpr';
	left: LeftExpr;
	right: RightExpr;
}

export interface GtExpr extends BinaryExpr {
	type: 'GtExpr';
	left: LeftExpr;
	right: RightExpr;
}

export interface GeExpr extends BinaryExpr {
	type: 'GeExpr';
	left: LeftExpr;
	right: RightExpr;
}

export interface LtExpr extends BinaryExpr {
	type: 'LtExpr';
	left: LeftExpr;
	right: RightExpr;
}

export interface LeExpr extends BinaryExpr {
	type: 'LeExpr';
	left: LeftExpr;
	right: RightExpr;
}

export type RelationalExpr =
	FunctionExpr
	| InExpr
	| OrExpr
	| EqExpr
	| NeExpr
	| GtExpr
	| GeExpr
	| LtExpr
	| LeExpr;

export interface AndExpr extends BinaryExpr {
	type: 'AndExpr';
	left: RelationalExpr;
	right: RelationalExpr;
}

export interface OrExpr extends BinaryExpr {
	type: 'OrExpr';
	left: AndExpr | RelationalExpr;
	right: AndExpr | RelationalExpr;
}

export interface ArrayExpr extends UnaryExpr {
	type: 'ArrayExpr';
	value: Primitive[];
}

export enum OrderByDirection {
	ASC = 'asc',
	DESC = 'desc',
}

export interface OrderByItem {
	type: 'OrderByItem';
	expr: LeftExpr;
	dir: OrderByDirection;
}

export type Filter = OrExpr | AndExpr | RelationalExpr;

export const parseFilter = (query: string): Filter => {
	return filterParser(query);
};

export type OrderBy = OrderByItem[];

export const parseOrderBy = (query: string): OrderBy => {
	return orderByParser(query);
};
