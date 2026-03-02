import React from 'react';
import { Box, Text } from 'ink';
import type { Framework } from '../types.js';

type HeaderProps = {
  version?: string;
  framework: Framework | undefined;
  totalFiles: number;
  durationSec: number;
};

export function Header({ version, framework, totalFiles, durationSec }: HeaderProps) {
  const fw = framework ?? 'detected';
  return (
    <Box borderStyle="round" borderColor="cyan" paddingX={1} paddingY={0}>
      <Box flexDirection="column">
        <Text bold>
          vibecode-check {version ? `v${version}` : ''}
        </Text>
        <Text dimColor>
          {fw}  ·  {totalFiles} files  ·  {durationSec.toFixed(1)}s
        </Text>
      </Box>
    </Box>
  );
}
