import type { Diagnostic } from '../types.js';
import type { Category } from '../types.js';
import { CATEGORY_ORDER } from './theme.js';

export function groupByCategory(diagnostics: Diagnostic[]): Map<Category, Diagnostic[]> {
  const map = new Map<Category, Diagnostic[]>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat as Category, []);
  }
  for (const d of diagnostics) {
    const list = map.get(d.category);
    if (list) list.push(d);
  }
  return map;
}

export function groupByRule(diagnostics: Diagnostic[]): Map<string, Diagnostic[]> {
  const map = new Map<string, Diagnostic[]>();
  for (const d of diagnostics) {
    if (!map.has(d.ruleId)) map.set(d.ruleId, []);
    map.get(d.ruleId)!.push(d);
  }
  return map;
}

export function sortRuleEntries(entries: [string, Diagnostic[]][]): [string, Diagnostic[]][] {
  return [...entries].sort((a, b) => {
    const aErr = a[1].some((d) => d.severity === 'error') ? 0 : 1;
    const bErr = b[1].some((d) => d.severity === 'error') ? 0 : 1;
    if (aErr !== bErr) return aErr - bErr;
    return b[1].length - a[1].length;
  });
}
