/*  ──────────────────────────────────────────────────────────────────────────
    SLR(1) shift‑reduce parser‑table generator  –  TypeScript edition
    ‑ Input grammar: array of strings   e.g.  ["E -> E + T | T", "T -> F"]
      ─ One production per line
      ─ Use ASCII "->" for the arrow and "|" to separate alternatives
      ─ Terminals = tokens that never appear on the left‑hand side.
        (If you want explicit control, wrap them in single quotes: "'id'")
      ─ The first rule’s LHS is treated as the start symbol S
    ‑ Output: { action, goto, states }
    ---------------------------------------------------------------------- */
import GrammarRule from "./GrammarRule";
export interface Item {
  lhs: string;      // left‑hand side symbol
  rhs: string[];    // right‑hand side symbols
  dot: number;      // position of the dot
}

export interface ParsingTable {
  action: Map<number, Map<string, string>>;       // ACTION[state, terminal] → "s3" | "r2" | "acc"
  goto  : Map<number, Map<string, number>>;       // GOTO[state, non‑terminal] → state
  states: Item[][];                               // canonical LR(0) item sets
}

export function buildParsingTable(grammarRules: GrammarRule[]): ParsingTable {
  /* ─────────────────── Helpers ─────────────────── */
  const arrayEquals = (a: any[], b: any[]) =>
    a.length === b.length && a.every((x, i) => x === b[i]);
  const itemKey = (it: Item) => `${it.lhs}→${it.rhs.join(" ")}·${it.dot}`;

  /* ── 1. Parse rules ───────────────────────────── */
  interface Production { lhs: string; rhs: string[]; }

  const productions: Production[] = [];
  const nonTerminals = new Set<string>();

  grammarRules.forEach(rule => {
    const nonTerminal = rule.get_before_arrow(); 
    const terminal = rule.get_after_arrow(); 
    nonTerminals.add(nonTerminal.trim());
    productions.push({ lhs: nonTerminal, rhs: terminal.trim().split(/\s+/) });
  });

  // Terminals = every symbol that never appears on a LHS
  const allSymbols = new Set<string>(
    productions.flatMap(p => p.rhs).concat([...nonTerminals])
  );
  const terminals = new Set<string>(
    [...allSymbols].filter(s => !nonTerminals.has(s)).concat(["$"])
  );

  /* ── 2. FIRST & FOLLOW sets ───────────────────── */
  const FIRST = new Map<string, Set<string>>(
    [...allSymbols].map(sym => [
      sym,
      new Set<string>(terminals.has(sym) ? [sym] : [])
    ])
  );

  const changed = () =>
    [...FIRST.values()].some(set => (set as any)._dirty);

  do {
    FIRST.forEach(set => delete (set as any)._dirty);
    productions.forEach(({ lhs, rhs }) => {
      const lhsFirst = FIRST.get(lhs)!;
      const oldSize = lhsFirst.size;

      for (const sym of rhs) {
        const symFirst = FIRST.get(sym)!;
        symFirst.forEach(t => t !== "ε" && lhsFirst.add(t));
        if (!symFirst.has("ε")) break;
      }
      if (rhs.every(sym => FIRST.get(sym)!.has("ε"))) lhsFirst.add("ε");

      if (lhsFirst.size !== oldSize) (lhsFirst as any)._dirty = true;
    });
  } while (changed());

  const FOLLOW = new Map<string, Set<string>>(
    [...nonTerminals].map(n => [n, new Set<string>()])
  );
  FOLLOW.get(productions[0].lhs)!.add("$");

  let updated: boolean;
  do {
    updated = false;
    productions.forEach(({ lhs, rhs }) => {
      for (let i = 0; i < rhs.length; ++i) {
        const B = rhs[i];
        if (!nonTerminals.has(B)) continue;

        // FIRST(beta)
        const beta = rhs.slice(i + 1);
        const trailer = new Set<string>();
        beta.forEach(sym =>
          FIRST.get(sym)!.forEach(t => t !== "ε" && trailer.add(t))
        );

        if (
          beta.length === 0 ||
          beta.every(sym => FIRST.get(sym)!.has("ε"))
        ) {
          FOLLOW.get(lhs)!.forEach(t => trailer.add(t));
        }

        const tgt = FOLLOW.get(B)!;
        const old = tgt.size;
        trailer.forEach(t => tgt.add(t));
        if (tgt.size !== old) updated = true;
      }
    });
  } while (updated);

  /* ── 3. Canonical LR(0) item sets ─────────────── */
  function closure(items: Item[]): Item[] {
    const set = new Map<string, Item>(items.map(it => [itemKey(it), it]));
    const queue = [...items];

    while (queue.length) {
      const it = queue.pop()!;
      const next = it.rhs[it.dot];
      if (nonTerminals.has(next)) {
        productions
          .filter(p => p.lhs === next)
          .forEach(p => {
            const ni: Item = { lhs: p.lhs, rhs: p.rhs, dot: 0 };
            const k = itemKey(ni);
            if (!set.has(k)) {
              set.set(k, ni);
              queue.push(ni);
            }
          });
      }
    }
    return [...set.values()];
  }

  // Augment grammar: S' → S
  const startProd: Production = { lhs: "S'", rhs: [productions[0].lhs] };
  productions.unshift(startProd);
  nonTerminals.add("S'");

  const states: Item[][] = [];
  const gotoMap: Map<string, number>[] = [];
  const stateId = new Map<string, number>();

  function getState(items: Item[]): number {
    const key = items.map(itemKey).sort().join("|");
    if (!stateId.has(key)) {
      stateId.set(key, states.length);
      states.push(items);
      gotoMap.push(new Map());
    }
    return stateId.get(key)!;
  }


  for (let i = 0; i < states.length; ++i) {
    const I = states[i];
    const symbols = new Set(
      I.map(it => it.rhs[it.dot]).filter(Boolean) as string[]
    );

    symbols.forEach(sym => {
      const moved = I.filter(it => it.rhs[it.dot] === sym).map(it => ({
        lhs: it.lhs,
        rhs: it.rhs,
        dot: it.dot + 1
      }));
      const J = closure(moved);
      const j = getState(J);
      gotoMap[i].set(sym, j);
    });
  }

  /* ── 4. ACTION & GOTO tables ──────────────────── */
  const action = new Map<number, Map<string, string>>();
  const goTo = new Map<number, Map<string, number>>();

  states.forEach((I, i) => {
    action.set(i, new Map());
    goTo.set(i, new Map());

    // shift actions
    gotoMap[i].forEach((j, sym) => {
      if (terminals.has(sym)) action.get(i)!.set(sym, `s${j}`);
      else if (nonTerminals.has(sym)) goTo.get(i)!.set(sym, j);
    });

    // reduce / accept actions
    I.forEach(it => {
      if (it.dot === it.rhs.length) {
        if (it.lhs === "S'") {
          action.get(i)!.set("$", "acc");
        } else {
          FOLLOW.get(it.lhs)!.forEach(a => {
            const old = action.get(i)!.get(a);
            const prodIdx = productions.findIndex(
              p => p.lhs === it.lhs && arrayEquals(p.rhs, it.rhs)
            );
            const red = `r${prodIdx}`;
            if (old && old !== red) {
              console.warn(
                `Conflict in state ${i} on '${a}': ${old} vs ${red}`
              );
            }
            action.get(i)!.set(a, red);
          });
        }
      }
    });
  });

  return { action, goto: goTo, states };
}