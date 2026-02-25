import React, { useState } from 'react';
import { VStack, HStack, Text, Button, Box, Divider } from '@react-native-material/core';
import { StyleSheet, Dimensions } from 'react-native';
import { RadioButtonList } from '../basics/RadioButtonList';
import { TRootStackParamList } from '../../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ERating2026 } from '../../../../common/types/2026';

const windowDimensions = Dimensions.get('window');

export type PEndgameScreenProps = NativeStackScreenProps<TRootStackParamList, 'EndgameOne'>;

export function EndgameOne({ navigation }: PEndgameScreenProps): React.JSX.Element {
  const [defenseRating, setDefenseRating] = useState<string>('0');
  const [firingRating, setFiringRating] = useState<ERating2026>();
  const [fuelPlowRating, setFuelPlowRating] = useState<ERating2026>();

  const onSubmit = () => {
    navigation.navigate('EndgameTwo', { firingRating, fuelPlowRating, defenseRating });
  };

  return (
    <Box style={styles.autoContainer}>
      <Text variant="h4">Endgame One</Text>
      <VStack>
        <Text variant="h6">Firing Rating:</Text>
        <RadioButtonList
          labels={Object.values(ERating2026)}
          direction="row"
          selected={firingRating}
          setSelected={(value: ERating2026) => {
            setFiringRating(value);
          }}
        />
        <Divider />
        <Text variant="h6">Fuel Plowing Rating:</Text>
        <RadioButtonList
          labels={Object.values(ERating2026)}
          direction="row"
          selected={fuelPlowRating}
          setSelected={(value: ERating2026) => {
            setFuelPlowRating(value);
          }}
        />
        <Divider />
        <Text variant="h6">Defense Rating:</Text>
        <RadioButtonList
          labels={Array.from({ length: 6 }, (_, i) => `${i}`)}
          direction="row"
          selected={defenseRating}
          setSelected={(value: string) => {
            setDefenseRating(value);
          }}
          maxPerRow={6}
        />
      </VStack>
      <HStack>
        <Button
          title="Continue"
          compact
          variant="contained"
          onPress={onSubmit}
          style={styles.button}
        />
      </HStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  autoContainer: {
    alignContent: 'center',
    alignItems: 'center',
    height: windowDimensions.height,
    width: windowDimensions.width,
  },
  button: {
    margin: 20,
    width: 100,
  },
  textInput: {
    height: 180,
    margin: 4,
    width: 450,
  },
});
