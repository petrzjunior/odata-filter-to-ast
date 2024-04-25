/*
 * Inspired by http://docs.oasis-open.org/odata/odata/v4.01/cs01/abnf/odata-abnf-construction-rules.txt
 */

Filter = OrExpr

OrderBy = head:OrderByItem tail:( "," elem:OrderByItem { return elem; } )* {
      return [head, ...tail];
    }

OrderByItem = expr:LeftExpr dir:( SP dir:Direction { return dir; } )? {
      return {
        type: 'OrderByItem',
        expr,
        dir: dir ?? 'asc',
      }
    }

// GROUPING
GroupingExpr = ParenExpr

ParenExpr = "(" value:Filter ")" {
      return value;
    }

// PRIMARY

PrimaryExpr
  = LeftExpr
  / RightExpr

LeftExpr
  = FunctionExpr
  / MemberExpr

RightExpr = Primitive

MemberExpr = value:OdataIdentifier {
      return {
        type: 'MemberExpr',
        value,
      };
    }

FunctionExpr = name:OdataIdentifier "(" head:PrimaryExpr tail:( "," arg:PrimaryExpr { return arg; } )* ")" {
      return {
        type: 'FunctionExpr',
        name,
        arguments: [head, ...tail],
      }
    }

// RELATIONAL

RelationalExpr
  = GroupingExpr
  / InExpr
  / EqExpr
  / NeExpr
  / GtExpr
  / GeExpr
  / LtExpr
  / LeExpr
  / FunctionExpr

InExpr = left:LeftExpr SP "in" SP right:ArrayExpr {
      return {
        type: 'InExpr',
        left,
        right
      }
    }

EqExpr = left:LeftExpr SP "eq" SP right:RightExpr {
      return {
        type: 'EqExpr',
        left,
        right,
      };
    }

NeExpr = left:LeftExpr SP "ne" SP right:RightExpr {
      return {
        type: 'NeExpr',
        left,
        right,
      };
    }

GtExpr = left:LeftExpr SP "gt" SP right:RightExpr {
      return {
        type: 'GtExpr',
        left,
        right,
      };
    }

GeExpr = left:LeftExpr SP "ge" SP right:RightExpr {
      return {
        type: 'GeExpr',
        left,
        right,
      };
    }

LtExpr = left:LeftExpr SP "lt" SP right:RightExpr {
      return {
        type: 'LtExpr',
        left,
        right,
      };
    }

LeExpr = left:LeftExpr SP "le" SP right:RightExpr {
      return {
        type: 'LeExpr',
        left,
        right,
      };
    }

// CONDITIONAL AND

AndExpr
  = left:RelationalExpr SP "and" SP right:AndExpr {
      return {
        type: 'AndExpr',
        left,
        right,
      };
    }
  / RelationalExpr

OrExpr
  = left:AndExpr SP "or" SP right:OrExpr {
      return {
        type: 'OrExpr',
        left,
        right,
      };
    }
  / AndExpr

// TOKENS

ArrayExpr = "[" head:Primitive tail:( "," elem:Primitive { return elem; } )* "]" {
      return {
        type: 'ArrayExpr',
        value: [head, ...tail],
      };
    }

Primitive
  = String
  / Number
  / Boolean
  / Null

String = DQUOTE value:[^"]+ DQUOTE {
      return {
        type: 'Primitive',
        value: value.join(''),
      }
    }

Number = SIGN? DIGIT+ ( "." DIGIT+ )? ( "e"i SIGN? DIGIT+ )? {
      return {
        type: 'Primitive',
        value: Number.parseFloat(text()),
      };
    }

Boolean = value:( "true"i / "false"i ) {
      return {
        type: 'Primitive',
        value: value === "true" ? true : false,
      };
    }

Null = "null" {
      return {
        type: 'Primitive',
        value: null,
      };
    }

Direction
  = "asc"
  / "desc"

OdataIdentifier = $( IdentifierLeadingCharacter IdentifierCharacter* )

IdentifierLeadingCharacter
  = ALPHA
  / "_"

IdentifierCharacter
  = ALPHA
  / "_"
  / DIGIT

SIGN
  = "+"
  / "-"

ALPHA
  = [\x41-\x5A]
  / [\x61-\x7A]

DIGIT = [\x30-\x39]

DQUOTE = "\x22"

SP = "\x20"
