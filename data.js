/* Legacy compatibility for older cached APHG pages. New pages use assets/data/aphg-unit1.js. */
const APHG_TERMS = (globalThis.APHG_UNIT1?.vocabulary || []).map(term => ({
  term: term.term,
  definition: term.definition,
  example: term.example,
  hook: term.hook
}));
