import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { CategoryPanel } from './CategoryPanel.js';
import { RuleDetail } from './RuleDetail.js';
import { groupByCategory } from './util.js';
import { groupByRule } from './util.js';
import { sortRuleEntries } from './util.js';
import { CATEGORY_ORDER } from './theme.js';
import type { Diagnostic, ScoreResult, Framework } from '../types.js';

const HELP_DASHBOARD = '↑↓ navigate  Enter expand  q quit  f fix';
const HELP_DETAIL = 'Esc back  f fix this rule';

type AppProps = {
  diagnostics: Diagnostic[];
  scoreResult: ScoreResult;
  framework: Framework | undefined;
  totalFiles: number;
  durationSec: number;
  version?: string;
  fixableCount: number;
  onExit: (exitCode: number) => void;
  onApplyFix: (diagnostics: Diagnostic[]) => void;
};

export function App({
  diagnostics,
  scoreResult,
  framework,
  totalFiles,
  durationSec,
  version,
  fixableCount,
  onExit,
  onApplyFix,
}: AppProps) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [ruleIndex, setRuleIndex] = useState(0);
  const [view, setView] = useState<'dashboard' | 'rule-detail'>('dashboard');
  const [detailRuleId, setDetailRuleId] = useState<string | null>(null);

  const byCategory = groupByCategory(diagnostics);
  const currentCategory = CATEGORY_ORDER[Math.min(categoryIndex, CATEGORY_ORDER.length - 1)];
  const currentDiagnostics = currentCategory ? (byCategory.get(currentCategory) ?? []) : [];
  const ruleEntries = sortRuleEntries([...groupByRule(currentDiagnostics).entries()]);
  const selectedRuleEntry = ruleEntries[ruleIndex];
  const detailDiagnostics = detailRuleId
    ? diagnostics.filter((d) => d.ruleId === detailRuleId)
    : [];
  const maxCategoryIndex = CATEGORY_ORDER.length - 1;
  const maxRuleIndex = ruleEntries.length - 1;

  useInput(
    (input, key) => {
      if (input === 'q') {
        onExit(0);
        return;
      }
      if (view === 'rule-detail') {
        if (key.escape) {
          setView('dashboard');
          setDetailRuleId(null);
        } else if (input === 'f' && detailDiagnostics.length > 0 && detailDiagnostics[0]?.autofix) {
          onApplyFix(detailDiagnostics);
        }
        return;
      }
      if (key.escape) {
        if (expandedCategory !== null) {
          setExpandedCategory(null);
        }
        return;
      }
      if (key.downArrow || input === 'j') {
        if (expandedCategory !== null) {
          setRuleIndex((i) => (i < maxRuleIndex ? i + 1 : i));
        } else {
          setCategoryIndex((i) => (i < maxCategoryIndex ? i + 1 : i));
        }
        return;
      }
      if (key.upArrow || input === 'k') {
        if (expandedCategory !== null) {
          setRuleIndex((i) => (i > 0 ? i - 1 : 0));
        } else {
          setCategoryIndex((i) => (i > 0 ? i - 1 : 0));
        }
        return;
      }
      if (key.return) {
        if (expandedCategory === null) {
          setExpandedCategory(categoryIndex);
          setRuleIndex(0);
        } else {
          if (selectedRuleEntry) {
            setDetailRuleId(selectedRuleEntry[0]);
            setView('rule-detail');
          }
        }
        return;
      }
      if (input === 'f' && expandedCategory !== null && selectedRuleEntry) {
        const [, diags] = selectedRuleEntry;
        if (diags[0]?.autofix) onApplyFix(diags);
      }
    },
    { isActive: true }
  );

  if (view === 'rule-detail' && detailDiagnostics.length > 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <RuleDetail
          ruleId={detailRuleId!}
          diagnostics={detailDiagnostics}
          onBack={() => { setView('dashboard'); setDetailRuleId(null); }}
        />
        <Box marginTop={1}>
          <Text dimColor>{HELP_DETAIL}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Header
        version={version}
        framework={framework}
        totalFiles={totalFiles}
        durationSec={durationSec}
      />
      <Box marginTop={1} flexDirection="column">
        {CATEGORY_ORDER.map((cat, i) => {
          const diags = byCategory.get(cat) ?? [];
          const score = scoreResult.scoreByCategory?.[cat] ?? 100;
          return (
            <Box key={cat} marginBottom={1}>
              <CategoryPanel
                category={cat}
                score={score}
                diagnostics={diags}
                isExpanded={expandedCategory === i}
                isFocused={categoryIndex === i}
                selectedRuleIndex={expandedCategory === i ? ruleIndex : 0}
              />
            </Box>
          );
        })}
      </Box>
      <Footer result={scoreResult} fixableCount={fixableCount} help={HELP_DASHBOARD} />
    </Box>
  );
}
