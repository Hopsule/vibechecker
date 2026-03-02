import React from 'react';
import { Box, Text } from 'ink';
import { progressBar, scoreColor } from './theme.js';
import type { ScoreResult } from '../types.js';

type FooterProps = {
  result: ScoreResult;
  fixableCount: number;
  help: string;
};

export function Footer({ result, fixableCount, help }: FooterProps) {
  const color = scoreColor(result.score);
  const bar = progressBar(result.score);
  return (
    <Box flexDirection="column">
      <Box borderStyle="round" borderColor={color} paddingX={1} paddingY={0}>
        <Box flexDirection="column">
          <Text bold>
            {result.score} / 100  ·  {result.label}
          </Text>
          <Text color={color}>{bar}</Text>
          {result.labelDescription && (
            <Text dimColor>{result.labelDescription}</Text>
          )}
          <Text dimColor>
            {fixableCount > 0 ? `${fixableCount} fixable  ·  ` : ''}
            {result.errors} errors  ·  {result.warnings} warnings
          </Text>
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>{help}</Text>
      </Box>
    </Box>
  );
}
