import { VStack, Pressable, Text } from '@react-native-material/core';
import { string } from 'prop-types';
import React, { useState } from 'react';

export type PButtonList<EnumType extends object> = {
  enumProp: EnumType;
  onPress?: (key: keyof EnumType) => void;
  onPressIn?: () => void | null;
  onPressOut?: () => void | null;
  selectedKey?: keyof EnumType | null; // Added prop for selection state
  disabled?: boolean;
};

export function ButtonList<EnumType extends object>({
  enumProp,
  onPress,
  onPressIn,
  onPressOut,
  selectedKey,
  disabled,
}: PButtonList<EnumType>): React.JSX.Element {
  // activeKey handles the momentary "tap" visual feedback
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <VStack spacing={15}>
      {(Object.values(enumProp) as Array<keyof EnumType>).filter((value)=> typeof value === 'string').map((key) => {
        const stringKey = String(key);
        // Highlight if currently being pressed OR if it is the selected item
        const isFilled = activeKey === stringKey || selectedKey === key;

        return (
          <Pressable
            disabled={disabled}
            key={stringKey}
            onPressIn={() => {
              setActiveKey(stringKey);
              if (onPressIn) {
                onPressIn();
              }
            }}
            onPressOut={() => {
              setActiveKey(null);
              selectedKey = null;
              if (onPressOut) {
                onPressOut();
              }
            }}
            onPress={() => {
              if (onPress) {
                onPress(key);
              }
            }}
            style={{
              padding: 10,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: disabled ? '#d3d3d3' : '#6200EE',
              backgroundColor: isFilled ? '#6200EE' : disabled ? '#d3d3d3' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              variant="h6"
              style={{
                color: isFilled || disabled ? '#FFFFFF' : '#6200EE',
              }}
            >
              {`${String(enumProp[key])}`}
            </Text>
          </Pressable>
        );
      })}
    </VStack>
  );
}
