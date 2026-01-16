import { VStack, Pressable, Text } from '@react-native-material/core';
import React, { useState } from 'react';

export type PButtonList<EnumType extends object> = {
  enumProp: EnumType;
  onPress: (key: keyof EnumType) => void;
};

export function ButtonList<EnumType extends object>({
  enumProp,
  onPress: onPress,
}: PButtonList<EnumType>): React.JSX.Element {
  // Track which item is currently being pressed by its key
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <VStack spacing={20}>
      {Object.keys(enumProp).map((key: string) => {
        const isPressed = activeKey === key;

        return (
          <Pressable
            key={key}
            onPressIn={() => setActiveKey(key)}
            onPressOut={() => setActiveKey(null)}
            onPress={() => onPress(key as keyof EnumType)}
            style={{
              padding: 20,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#6200EE',
              // Solid fill color when active
              backgroundColor: isPressed ? '#6200EE' : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              variant="h6"
              style={{
                // Invert text color when background is filled
                color: isPressed ? '#FFFFFF' : '#6200EE',
              }}
            >
              {`${enumProp[key as keyof EnumType]}`}
            </Text>
          </Pressable>
        );
      })}
    </VStack>
  );
}
