import { Stack, HStack } from '@react-native-material/core';
import React from 'react';
import { FlexStyle } from 'react-native';
import { RadioButton } from 'react-native-paper';

export type PRadioButtonList = {
  labels: string[];
  direction?: FlexStyle['flexDirection'];
  position?: 'leading' | 'trailing';
  selected: string;
  setSelected: (value: string) => void;
  maxPerRow?: number;
};

function chunkArray(arr: string[], chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

export function RadioButtonList({
  labels,
  direction = 'column',
  position = 'trailing',
  selected,
  setSelected,
  maxPerRow = 5,
}: PRadioButtonList): React.JSX.Element {
  const rows = chunkArray(labels, maxPerRow);

  return (
    <RadioButton.Group onValueChange={(newValue) => setSelected(newValue)} value={selected}>
      <Stack direction={direction === 'column' ? 'row' : 'column'}>
        {rows.map((labels, i) => {
          return (
            <Stack direction={direction} key={i}>
              {labels.map((label: string) => {
                return (
                  <HStack key={label}>
                    <RadioButton.Item label={label} value={label} position={position} />
                  </HStack>
                );
              })}
            </Stack>
          );
        })}
      </Stack>
    </RadioButton.Group>
  );
}
