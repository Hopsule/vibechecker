import React from 'react';
import { Box, Text } from 'ink';
import type { Diagnostic } from '../types.js';

type RuleDetailProps = {
  ruleId: string;
  diagnostics: Diagnostic[];
  onBack: () => void;
};

const MAX_FILES = 8;

export function RuleDetail({ ruleId, diagnostics, onBack }: RuleDetailProps) {
  const first = diagnostics[0];
  if (!first) return null;
  const fixable = first.autofix != null;
  const severity = first.severity;
  const message = first.message;
  const files = [...new Set(diagnostics.map((d) => `${d.filePath}:${d.line}:${d.column}`))];
  const topFiles = files.slice(0, MAX_FILES);
  const moreCount = files.length - MAX_FILES;
  const fixText = first.fix ? first.fix.split('\n')[0] : '';

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="gray" paddingX={1} paddingY={0}>
      <Text bold> {ruleId} </Text>
      <Text dimColor>
        {diagnostics.length} occurrences  ·  {severity}  {fixable ? '·  fixable' : ''}
      </Text>
      <Box marginTop={1}>
        <Text>{message}</Text>
      </Box>
      {topFiles.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>Top files:</Text>
          {topFiles.map((f, i) => (
            <Text key={i} dimColor> {i + 1}. {f}</Text>
          ))}
          {moreCount > 0 && (
            <Text dimColor> ... +{moreCount} more</Text>
          )}
        </Box>
      )}
      {fixText && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="green">Fix:</Text>
          <Text dimColor>{fixText}</Text>
        </Box>
      )}
      <Box marginTop={1}>
        <Text dimColor>Esc back  f fix this rule</Text>
      </Box>
    </Box>
  );
}
