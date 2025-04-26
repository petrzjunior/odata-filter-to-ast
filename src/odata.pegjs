/*
 * Inspired by http://docs.oasis-open.org/odata/odata/v4.01/cs01/abnf/odata-abnf-construction-rules.txt
 */

Filter = OrExpr

OrderBy = head:OrderByItem tail:( OWS "," OWS elem:OrderByItem { return elem; } )* OWS {
      return [head, ...tail];
    }

OrderByItem = expr:PrimaryExpr dir:( RWS dir:Direction { return dir; } )? {
      return {
        type: 'OrderByItem',
        expr,
        dir: dir ?? 'asc',
      }
    }

// GROUPING
GroupingExpr = ParenExpr

ParenExpr = "(" OWS value:Filter OWS ")" {
      return value;
    }

// PRIMARY

PrimaryExpr
  = FunctionExpr
  / ArrayExpr
  / Primitive
  / MemberExpr

MemberExpr = value:OdataIdentifier {
      return {
        type: 'MemberExpr',
        value,
      };
    }

FunctionExpr = name:OdataIdentifier "(" OWS head:PrimaryExpr tail:( OWS "," OWS arg:PrimaryExpr { return arg; } )* OWS ")" {
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

InExpr = left:PrimaryExpr RWS "in" RWS right:ArrayExpr {
      return {
        type: 'InExpr',
        left,
        right
      }
    }

EqExpr = left:PrimaryExpr RWS "eq" RWS right:PrimaryExpr {
      return {
        type: 'EqExpr',
        left,
        right,
      };
    }

NeExpr = left:PrimaryExpr RWS "ne" RWS right:PrimaryExpr {
      return {
        type: 'NeExpr',
        left,
        right,
      };
    }

GtExpr = left:PrimaryExpr RWS "gt" RWS right:PrimaryExpr {
      return {
        type: 'GtExpr',
        left,
        right,
      };
    }

GeExpr = left:PrimaryExpr RWS "ge" RWS right:PrimaryExpr {
      return {
        type: 'GeExpr',
        left,
        right,
      };
    }

LtExpr = left:PrimaryExpr RWS "lt" RWS right:PrimaryExpr {
      return {
        type: 'LtExpr',
        left,
        right,
      };
    }

LeExpr = left:PrimaryExpr RWS "le" RWS right:PrimaryExpr {
      return {
        type: 'LeExpr',
        left,
        right,
      };
    }

// CONDITIONAL AND

AndExpr
  = left:RelationalExpr RWS "and" RWS right:AndExpr {
      return {
        type: 'AndExpr',
        left,
        right,
      };
    }
  / RelationalExpr

OrExpr
  = left:AndExpr RWS "or" RWS right:OrExpr {
      return {
        type: 'OrExpr',
        left,
        right,
      };
    }
  / AndExpr

// TOKENS

ArrayExpr
  = ArrayCollectionExpr
  / ArrayJsonExpr

ArrayCollectionExpr = "(" OWS head:Primitive tail:( OWS "," OWS elem:Primitive { return elem; } )* OWS ")" {
      return {
        type: 'ArrayExpr',
        value: [head, ...tail],
      };
    }

ArrayJsonExpr = "[" OWS head:Primitive tail:( OWS "," OWS elem:Primitive { return elem; } )* OWS "]" {
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

String = SQUOTE value:( SquoteInString / StringNoSquote )* SQUOTE {
      return {
        type: 'Primitive',
        value: value.join(''),
      }
    }

SquoteInString = SQUOTE SQUOTE {
	  return "'";
	}


StringNoSquote = value:[^']+ {
		return text();
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

SQUOTE = "\x27"

SP = "\x20"

// OPTIONAL WHITESPACE
OWS = SP*

// REQUIRED WHITESPACE
RWS = SP+
