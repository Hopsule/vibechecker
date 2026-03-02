import React from 'react';
import { Box, Text } from 'ink';
import { progressBar, scoreColor, CATEGORY_LABELS } from './theme.js';
import { RuleList } from './RuleList.js';
import type { Diagnostic } from '../types.js';
import type { Category } from '../types.js';

type CategoryPanelProps = {
  category: Category;
  score: number;
  diagnostics: Diagnostic[];
  isExpanded: boolean;
  isFocused: boolean;
  selectedRuleIndex: number;
};

export function CategoryPanel({
  category,
  score,
  diagnostics,
  isExpanded,
  isFocused,
  selectedRuleIndex,
}: CategoryPanelProps) {
  const label = CATEGORY_LABELS[category] ?? category;
  const color = scoreColor(score);
  const bar = progressBar(score);
  const arrow = isExpanded ? '▾' : '▸';

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={isFocused ? 'cyan' : undefined} bold={isFocused}>
          {arrow} {label} ·················· {score}/100
        </Text>
      </Box>
      <Box>
        <Text color={color}>  {bar}</Text>
      </Box>
      {isExpanded && diagnostics.length > 0 && (
        <RuleList diagnostics={diagnostics} selectedIndex={selectedRuleIndex} />
      )}
    </Box>
  );
}
