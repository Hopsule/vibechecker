import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { scan } from '../scanner.js';
import { computeScore } from '../scorer.js';
import { applyFixes } from '../fixer.js';
import { resolveSeverityOverrides } from '../config.js';
import type { Config } from '../types.js';
import { ScanView } from './ScanView.js';
import { App } from './App.js';
import type { Framework } from '../types.js';

export type ScanOptions = {
  targetPath: string;
  framework: Framework | undefined;
  configIgnoreFiles: string[];
  configIgnoredRules: Set<string>;
  config?: Config | null;
};

type RootProps = {
  scanOptions: ScanOptions;
  version?: string;
  onExit: (code: number) => void;
};

export function Root({ scanOptions, version, onExit }: RootProps) {
  const [state, setState] = useState<
    | { phase: 'scanning' }
    | { phase: 'done'; diagnostics: import('../types.js').Diagnostic[]; totalFiles: number; durationMs: number }
    | { phase: 'error'; message: string }
  >({ phase: 'scanning' });

  useEffect(() => {
    const start = performance.now();
    scan({
      targetPath: scanOptions.targetPath,
      framework: scanOptions.framework,
      configIgnoreFiles: scanOptions.configIgnoreFiles,
      configIgnoredRules: scanOptions.configIgnoredRules,
    })
      .then(({ diagnostics, totalFiles }) => {
        const durationMs = performance.now() - start;
        setState({ phase: 'done', diagnostics, totalFiles, durationMs });
      })
      .catch((err) => {
        setState({ phase: 'error', message: String(err?.message ?? err) });
      });
  }, []);

  if (state.phase === 'scanning') {
    return (
      <Box padding={1}>
        <ScanView message="Scanning files..." />
      </Box>
    );
  }

  if (state.phase === 'error') {
    return (
      <Box padding={1}>
        <Text color="red">Error: {state.message}</Text>
      </Box>
    );
  }

  const { diagnostics, totalFiles, durationMs } = state;
  const severityOverrides = resolveSeverityOverrides(scanOptions.config ?? {});
  for (const d of diagnostics) {
    const override = severityOverrides.get(d.ruleId);
    if (override) d.severity = override;
  }
  const scoreResult = computeScore(diagnostics, totalFiles, {
    categoryWeights: scanOptions.config?.categoryWeights,
  });
  const fixableCount = diagnostics.filter((d) => d.autofix != null).length;

  const handleApplyFix = (diags: import('../types.js').Diagnostic[]) => {
    applyFixes(diags, { dryRun: false });
    onExit(0);
  };

  return (
    <App
      diagnostics={diagnostics}
      scoreResult={scoreResult}
      framework={scanOptions.framework}
      totalFiles={totalFiles}
      durationSec={durationMs / 1000}
      version={version}
      fixableCount={fixableCount}
      onExit={onExit}
      onApplyFix={handleApplyFix}
    />
  );
}
