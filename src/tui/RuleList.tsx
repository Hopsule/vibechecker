import React from 'react';
import { Box, Text } from 'ink';
import type { Diagnostic } from '../types.js';
import { sortRuleEntries } from './util.js';
import { groupByRule } from './util.js';

type RuleListProps = {
  diagnostics: Diagnostic[];
  selectedIndex: number;
};

const MAX_VISIBLE = 8;

export function RuleList({ diagnostics, selectedIndex }: RuleListProps) {
  const byRule = groupByRule(diagnostics);
  const sorted = sortRuleEntries([...byRule.entries()]);
  const visible = sorted.slice(0, MAX_VISIBLE);
  const rest = sorted.length - MAX_VISIBLE;

  return (
    <Box flexDirection="column" marginLeft={2}>
      {visible.map(([ruleId, list], i) => {
        const first = list[0]!;
        const isSelected = i === selectedIndex;
        const icon = first.severity === 'error' ? '✗' : '⚠';
        const fixable = first.autofix != null;
        return (
          <Box key={ruleId}>
            <Text color={isSelected ? 'cyan' : undefined} bold={isSelected}>
              {isSelected ? '▸ ' : '  '}{icon}  {ruleId} ({list.length})
              {fixable ? ' [fixable]' : ''}
            </Text>
          </Box>
        );
      })}
      {rest > 0 && (
        <Text dimColor>   ... +{rest} more</Text>
      )}
    </Box>
  );
}
