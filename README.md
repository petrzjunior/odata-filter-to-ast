# odata-filter-to-ast

Simple [OData](https://www.odata.org/) `$filter` query parser with zero dependencies.

![npm version](https://img.shields.io/npm/v/odata-filter-to-ast)
![MIT license](https://img.shields.io/npm/l/odata-filter-to-ast)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/petrzjunior/odata-filter-to-ast)
![npm](https://img.shields.io/npm/dw/odata-filter-to-ast)

## Usage

```shell
$ npm install odata-filter-to-ast
```

Usage in code:
```js
import {parseFilter} from 'odata-filter-to-ast';

parseFilter(`Name gt "Milk" or Price lt -2.55 or Size ne 3`)
```

Result:

```json5
{
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
		right: {
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
}
```

## Supported constructs

The following construct from [OData specification](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html) are supported:
- JS primitives `-42`, `3.14`, `6.022e23`, `"string"`, `true`, `false`, `null`
- field identifiers `iDenT_iFi3r`
- heterogeneous arrays `["a","r","r","a","y",7,false,null]`
- primitive relations `eq`, `ne`, `gt`, `gt`, `lt`, `le`
- array relation `in`
- boolean conjunctions `and`, `or`
- precedence grouping `( ... )`
- function calls `includes(Name,"Joe")`

## Related

Built using https://github.com/peggyjs/peggy and https://github.com/metadevpro/ts-pegjs
