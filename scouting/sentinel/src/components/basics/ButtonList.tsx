import { VStack, Pressable, Text } from '@react-native-material/core';
import React, { useState } from 'react';

export type PButtonList<EnumType extends object> = {
  enumProp: EnumType;
  onPress: (key: keyof EnumType) => void;
  onPressOut?: () => void | null;
  selectedKey?: keyof EnumType | null; // Added prop for selection state
};

export function ButtonList<EnumType extends object>({
  enumProp,
  onPress,
  selectedKey,
  onPressOut,
}: PButtonList<EnumType>): React.JSX.Element {
  // activeKey handles the momentary "tap" visual feedback
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <VStack spacing={20}>
      {(Object.keys(enumProp) as Array<keyof EnumType>).map((key) => {
        const stringKey = String(key);
        // Highlight if currently being pressed OR if it is the selected item
        const isFilled = activeKey === stringKey || selectedKey === key;

        return (
          <Pressable
            key={stringKey}
            onPressIn={() => setActiveKey(stringKey)}
            onPressOut={() => {
              setActiveKey(null);
              if (onPressOut) {
                onPressOut();
              }
            }}
            onPress={() => onPress(key)}
            style={{
              padding: 20,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#6200EE',
              backgroundColor: isFilled ? '#6200EE' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              variant="h6"
              style={{
                color: isFilled ? '#FFFFFF' : '#6200EE',
              }}
            >
              {`${enumProp[key]}`}
            </Text>
          </Pressable>
        );
      })}
    </VStack>
  );
}
