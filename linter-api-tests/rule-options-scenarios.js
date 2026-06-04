export default [
  {
    rules: {
      // ── func-names: 4th element removal ──────────────────────────────────
      // Case 1: extra trailing mode string
      'func-names': ['error', 'always', {}],
      // Case 2: different severity and modes
      'func-names': ['warn', 'as-needed', {}],
      // Case 3: 0/1/2 numeric severity
      'func-names': [2, 'always', {}],
      // Case 4: only 3 elements — must NOT be touched
      'func-names': ['error', 'always', {}],
      // Case 5: only severity — must NOT be touched
      'func-names': 'error',
      // Case 6: only 2 elements — must NOT be touched
      'func-names': ['error', 'always'],

      // ── no-invalid-regexp: duplicate flag deduplication ──────────────────
      // Case 7: single duplicate
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'y'] }],
      // Case 8: multiple duplicates
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['g', 'i', 'm'] }],
      // Case 9: no duplicates — must NOT be touched
      'no-invalid-regexp': ['error', { allowConstructorFlags: ['u', 'y'] }],
      // Case 10: no options — must NOT be touched
      'no-invalid-regexp': 'error',
    },
  },
]
