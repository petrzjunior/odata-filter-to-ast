import {parse} from './odata-grammar';

export type OdataIdentifier = string;

export type LeftExpr = MemberExpr;

export type RightExpr = Primitive;

export type PrimaryExpr = LeftExpr | RightExpr;

export interface UnaryExpr {
	type: string;
	value: unknown;
}

export interface Primitive extends UnaryExpr {
	type: 'primitive',
	value: string | number | boolean | null;
}

export interface BinaryExpr {
	type: string;
	left: unknown;
	right: unknown;
}

export interface MemberExpr extends UnaryExpr {
	type: 'memberExpr',
	value: OdataIdentifier,
}

export interface FunctionExpr {
	type: 'functionExpr',
	name: string,
	arguments: PrimaryExpr[],
}

export interface InExpr extends BinaryExpr {
	type: 'inExpr',
	left: LeftExpr,
	right: ArrayExpr,
}

export interface EqExpr extends BinaryExpr {
	type: 'eqExpr',
	left: LeftExpr,
	right: RightExpr,
}

export interface NeExpr extends BinaryExpr {
	type: 'neExpr',
	left: LeftExpr,
	right: RightExpr,
}

export interface GtExpr extends BinaryExpr {
	type: 'gtExpr',
	left: LeftExpr,
	right: RightExpr,
}

export interface GeExpr extends BinaryExpr {
	type: 'geExpr',
	left: LeftExpr,
	right: RightExpr,
}

export interface LtExpr extends BinaryExpr {
	type: 'ltExpr',
	left: LeftExpr,
	right: RightExpr,
}

export interface LeExpr extends BinaryExpr {
	type: 'leExpr',
	left: LeftExpr,
	right: RightExpr,
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
	type: 'andExpr',
	left: RelationalExpr,
	right: RelationalExpr,
}

export interface OrExpr extends BinaryExpr {
	type: 'orExpr',
	left: AndExpr | RelationalExpr,
	right: AndExpr | RelationalExpr,
}

export interface ArrayExpr extends UnaryExpr {
	type: 'arrayExpr',
	value: Primitive[];
}

export type Expression = OrExpr | AndExpr | RelationalExpr;

export const parseFilter = (query: string): Expression => {
	return parse(query);
};
