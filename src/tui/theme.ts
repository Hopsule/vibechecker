export const BAR_WIDTH = 36;
export const CATEGORY_ORDER = [
  'correctness',
  'performance',
  'accessibility',
  'best-practice',
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  correctness: 'Correctness',
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practice': 'Best Practice',
};

export function scoreColor(score: number): 'green' | 'yellow' | 'red' {
  if (score >= 80) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

export function progressBar(score: number, width: number = BAR_WIDTH): string {
  const filled = Math.round((score / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
