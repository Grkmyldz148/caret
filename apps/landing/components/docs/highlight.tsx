/**
 * Tiny syntax highlighter for the docs code blocks.
 *
 * Optimised for the languages docs actually use (ts, tsx, sh, json,
 * css). A regex scanner walks the input, matches the first pattern
 * that fits, and emits typed tokens. Fewer rules = faster, easier to
 * audit, and trivial to theme.
 *
 * Why not Shiki / Prism? They ship 20–200 KB of grammars and a
 * full themed CSS layer that fights our token system. We don't need
 * 100% language fidelity — keywords, strings, comments, and numbers
 * cover the docs.
 */

export type TokenKind =
  | 'keyword'
  | 'string'
  | 'comment'
  | 'number'
  | 'literal'
  | 'fn'
  | 'type'
  | 'punct'
  | 'text'

export type Token = { kind: TokenKind; value: string }

type Rule = { kind: TokenKind; pattern: RegExp }

const TS_KEYWORDS = new Set([
  'import', 'export', 'from', 'as',
  'const', 'let', 'var',
  'function', 'class', 'extends', 'implements',
  'interface', 'type', 'enum',
  'async', 'await', 'return', 'throw', 'yield',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case',
  'break', 'continue', 'try', 'catch', 'finally',
  'new', 'in', 'of', 'instanceof', 'typeof', 'void',
  'this', 'super',
  'public', 'private', 'protected', 'readonly', 'static', 'declare',
  'default',
])

const TS_LITERALS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'])
const TS_TYPES = new Set([
  'string', 'number', 'boolean', 'object', 'symbol',
  'any', 'unknown', 'never', 'bigint',
  'Array', 'ReadonlyArray', 'Promise', 'Record',
  'Map', 'Set', 'Date',
])

const SH_KEYWORDS = new Set([
  'if', 'then', 'else', 'elif', 'fi',
  'for', 'do', 'done', 'while', 'until',
  'case', 'esac',
  'function', 'return', 'exit',
  'export', 'set', 'unset',
])

function tsRules(): Rule[] {
  return [
    // Multi-line comment (rough — assumes no nested */)
    { kind: 'comment', pattern: /^\/\*[\s\S]*?\*\// },
    // Line comment
    { kind: 'comment', pattern: /^\/\/[^\n]*/ },
    // Template literal — keep whole thing as a string for simplicity
    { kind: 'string', pattern: /^`(?:[^`\\]|\\.)*`/ },
    // Double / single-quoted string
    { kind: 'string', pattern: /^"(?:[^"\\]|\\.)*"/ },
    { kind: 'string', pattern: /^'(?:[^'\\]|\\.)*'/ },
    // Number — int / float / hex
    { kind: 'number', pattern: /^0x[0-9a-fA-F]+|^[0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/ },
    // Identifier — classified later
    { kind: 'text', pattern: /^[A-Za-z_$][A-Za-z0-9_$]*/ },
    // Whitespace / newline
    { kind: 'text', pattern: /^[ \t\n]+/ },
    // Anything else — single character
    { kind: 'punct', pattern: /^[^A-Za-z_$0-9]/ },
  ]
}

function shRules(): Rule[] {
  return [
    // Comment to end of line
    { kind: 'comment', pattern: /^#[^\n]*/ },
    // Strings
    { kind: 'string', pattern: /^"(?:[^"\\]|\\.)*"/ },
    { kind: 'string', pattern: /^'(?:[^'\\]|\\.)*'/ },
    // $VAR / ${VAR}
    { kind: 'literal', pattern: /^\$\{[^}]+\}/ },
    { kind: 'literal', pattern: /^\$[A-Za-z_][A-Za-z0-9_]*/ },
    // Number
    { kind: 'number', pattern: /^[0-9]+/ },
    // Identifier — classified later
    { kind: 'text', pattern: /^[A-Za-z_/][A-Za-z0-9_./-]*/ },
    // Whitespace
    { kind: 'text', pattern: /^[ \t\n]+/ },
    // Punctuation
    { kind: 'punct', pattern: /^[^A-Za-z_$0-9]/ },
  ]
}

function jsonRules(): Rule[] {
  return [
    { kind: 'string', pattern: /^"(?:[^"\\]|\\.)*"/ },
    { kind: 'literal', pattern: /^(?:true|false|null)\b/ },
    { kind: 'number', pattern: /^-?[0-9]+(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/ },
    { kind: 'text', pattern: /^[ \t\n]+/ },
    { kind: 'punct', pattern: /^[^"truefalsnl0-9 \t\n]+/ },
  ]
}

function cssRules(): Rule[] {
  return [
    { kind: 'comment', pattern: /^\/\*[\s\S]*?\*\// },
    { kind: 'string', pattern: /^"(?:[^"\\]|\\.)*"/ },
    { kind: 'string', pattern: /^'(?:[^'\\]|\\.)*'/ },
    // CSS custom properties / functions
    { kind: 'keyword', pattern: /^@[a-zA-Z-]+/ },
    { kind: 'literal', pattern: /^--[a-zA-Z0-9-]+/ },
    { kind: 'fn', pattern: /^[a-zA-Z-]+(?=\()/ },
    { kind: 'number', pattern: /^-?[0-9]+(?:\.[0-9]+)?(?:px|em|rem|vh|vw|%|deg|ms|s|hz)?/i },
    { kind: 'text', pattern: /^[A-Za-z_-][A-Za-z0-9_-]*/ },
    { kind: 'text', pattern: /^[ \t\n]+/ },
    { kind: 'punct', pattern: /^./ },
  ]
}

function pickRules(lang: string): Rule[] | null {
  switch (lang) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return tsRules()
    case 'sh':
    case 'bash':
    case 'shell':
      return shRules()
    case 'json':
      return jsonRules()
    case 'css':
      return cssRules()
    default:
      return null
  }
}

function classifyTsIdent(value: string, prevPunct: string | null): TokenKind {
  if (TS_KEYWORDS.has(value)) return 'keyword'
  if (TS_LITERALS.has(value)) return 'literal'
  if (TS_TYPES.has(value)) return 'type'
  // Capitalised identifier — likely a class / type
  if (/^[A-Z]/.test(value)) return 'type'
  // Followed by `(` ⇒ function name (looked up by the caller via prevPunct context)
  return 'text'
}

function classifyShIdent(value: string, atLineStart: boolean): TokenKind {
  if (SH_KEYWORDS.has(value)) return 'keyword'
  // Common CLI verbs treated as functions for visual rhythm.
  if (atLineStart && /^[a-z][a-zA-Z0-9-]*$/.test(value)) return 'fn'
  return 'text'
}

export function tokenize(code: string, lang: string): Token[] {
  const rules = pickRules(lang)
  if (!rules) return [{ kind: 'text', value: code }]

  const tokens: Token[] = []
  let rest = code
  let prevPunct: string | null = null
  let lineStart = true

  // Look ahead for `(` to upgrade text identifier to fn.
  const peekFnCall = (consumed: number) => rest[consumed] === '('

  while (rest.length > 0) {
    let matched = false

    for (const rule of rules) {
      const m = rule.pattern.exec(rest)
      if (!m || m.index !== 0) continue
      let kind = rule.kind
      let value = m[0]

      if (kind === 'text' && /^[A-Za-z_$]/.test(value)) {
        if (lang === 'ts' || lang === 'tsx' || lang === 'js' || lang === 'jsx') {
          kind = classifyTsIdent(value, prevPunct)
          if (kind === 'text' && peekFnCall(value.length)) kind = 'fn'
        } else if (lang === 'sh' || lang === 'bash' || lang === 'shell') {
          kind = classifyShIdent(value, lineStart)
        }
      }

      tokens.push({ kind, value })

      // Track whether the next identifier sits at the start of a line
      // (sh uses this to colour command names).
      if (value.includes('\n')) {
        const after = value.slice(value.lastIndexOf('\n') + 1)
        lineStart = after.trim().length === 0
      } else if (kind === 'text' && /^[ \t]*$/.test(value)) {
        // pure whitespace — keep state
      } else {
        lineStart = false
      }

      // Track prev punctuation glyph for TS classifier hooks.
      if (kind === 'punct') prevPunct = value
      else if (kind !== 'text' || !/^\s+$/.test(value)) prevPunct = null

      rest = rest.slice(value.length)
      matched = true
      break
    }

    if (!matched) {
      tokens.push({ kind: 'text', value: rest[0]! })
      rest = rest.slice(1)
    }
  }

  return tokens
}

const KIND_CLASS: Record<TokenKind, string> = {
  keyword: 'text-accent',
  string: 'text-success',
  comment: 'text-subtle italic',
  number: 'text-warning',
  literal: 'text-info',
  fn: '',
  type: 'text-warning',
  punct: 'text-muted',
  text: '',
}

export function HighlightedCode({
  code,
  lang,
}: {
  code: string
  lang: string
}) {
  const tokens = tokenize(code, lang)
  return (
    <>
      {tokens.map((t, i) => {
        const cls = KIND_CLASS[t.kind]
        if (cls === '') return <span key={i}>{t.value}</span>
        return (
          <span key={i} className={cls}>
            {t.value}
          </span>
        )
      })}
    </>
  )
}
