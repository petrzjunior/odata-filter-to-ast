# odata-filter-to-ast

Simple [OData](https://www.odata.org/) query parser with zero dependencies.

![npm version](https://img.shields.io/npm/v/odata-filter-to-ast)
![MIT license](https://img.shields.io/npm/l/odata-filter-to-ast)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/petrzjunior/odata-filter-to-ast)
![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![npm](https://img.shields.io/npm/dw/odata-filter-to-ast)

## Usage

```shell
$ npm install odata-filter-to-ast
```

Usage in code:

```js
import {parseFilter, parseOrderBy} from 'odata-filter-to-ast';

parseFilter(`Name gt "Milk" or Price lt -2.55 or Size ne 3`);
parseOrderBy(`age,sum(height,width) desc`);
```

Result:

```js
{
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
}
[
	{
		type: 'OrderByItem',
		expr: {
			type: 'MemberExpr',
			value: 'age',
		},
		dir: 'asc',
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
		dir: 'desc',
	},
]
```

## Supported constructs

The following construct
from [OData specification](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html) are
supported:

- JS primitives `-42`, `3.14`, `6.022e23`, `"string"`, `true`, `false`, `null`
- field identifiers `iDenT_iFi3r`
- heterogeneous arrays `["a","r","r","a","y",7,false,null]`
- primitive relations `eq`, `ne`, `gt`, `gt`, `lt`, `le`
- array relation `in`
- boolean conjunctions `and`, `or`
- operator priority grouping `( ... )`
- function calls `includes(Name,"Joe")`
- sort directions `asc`, `desc`

## Related

- Parser built using [Peggy](https://github.com/peggyjs/peggy) and [TS PEG.js](https://github.com/metadevpro/ts-pegjs)
- Grammar inspired by the [OData specification](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html#_Toc31361038) and the [OData ABNF Construction Rules](http://docs.oasis-open.org/odata/odata/v4.01/cs01/abnf/odata-abnf-construction-rules.txt)
