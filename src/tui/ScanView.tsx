import React from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';

type ScanViewProps = {
  message: string;
};

export function ScanView({ message }: ScanViewProps) {
  return (
    <Box>
      <Spinner type="dots" />
      <Text> {message}</Text>
    </Box>
  );
}
