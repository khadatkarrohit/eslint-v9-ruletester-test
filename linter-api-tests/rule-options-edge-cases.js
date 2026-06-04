export default [
  {
    rules: {
      // ════════════════════════════════════════════════════════
      // TRANSFORM 5: func-names — edge cases
      // ════════════════════════════════════════════════════════

      // ── Standard 4-element removal ────────────────────────
      'func-names': ['error', 'always', {}],
      'func-names': ['warn', 'never', {}],

      // ── Numeric severity ──────────────────────────────────
      'func-names': [2, 'always', {}],
      'func-names': [1, 'as-needed', {}],
      'func-names': [0, 'always', {}],

      // ── Options object with properties ────────────────────
      'func-names': ['error', 'always', { generators: 'never' }],
      'func-names': ['error', 'as-needed', { generators: 'always' }],

      // ── Double-quoted rule name ────────────────────────────
      "func-names": ['error', 'always', {}],

      // ── Must NOT be touched — 3 elements only ─────────────
      'func-names': ['error', 'always', {}],
      'func-names': ['error', 'always', { generators: 'never' }],

      // ── Must NOT be touched — 2 elements ──────────────────
      'func-names': ['error', 'always'],

      // ── Must NOT be touched — severity only ───────────────
      'func-names': 'error',
      'func-names': 2,

      // ════════════════════════════════════════════════════════
      // TRANSFORM 6: no-invalid-regexp — edge cases
      // ════════════════════════════════════════════════════════

      // ── Single duplicate ──────────────────────────────────
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'y'] }],

      // ── Multiple different duplicates ─────────────────────
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['g', 'i', 'm'] }],

      // ── All same — reduce to one ──────────────────────────
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['u'] }],

      // ── Two pairs of duplicates ───────────────────────────
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'v'] }],

      // ── Must NOT be touched — no duplicates ───────────────
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'y'] }],

      // ── Must NOT be touched — single flag ────────────────
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['u'] }],

      // ── Must NOT be touched — empty array ────────────────
      'no-invalid-regexp': ['error', { allowConstructorFlags: [] }],

      // ── Must NOT be touched — no options ─────────────────
      'no-invalid-regexp': 'error',
      'no-invalid-regexp': ['error'],
    },
  },
]
