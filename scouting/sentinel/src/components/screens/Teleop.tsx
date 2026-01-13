import React, { useState } from 'react';
import { Box, Button, HStack, Text } from '@react-native-material/core';
import { Image, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { TLogActions, TRootStackParamList } from '../../../types';
import { TAssignment } from '../../../../common/types';
import blueFieldImage from '../../../assets/blueField.png';
import redFieldImage from '../../../assets/redField.png';
import { useAssignment } from '../../contexts/AssignmentContext';
import { ViewTimer } from '../basics/ViewTimer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLog } from '../../contexts/LogContext';

export type PTeleop = NativeStackScreenProps<TRootStackParamList, 'Teleop'>;

export function Teleop({ navigation }: PTeleop): React.JSX.Element {
  const [autoClimb, setAutoClimb] = useState<'checked' | 'unchecked'>('unchecked');

  const assignment: TAssignment = useAssignment();
  const log: TLogActions = useLog();

  const toEndgame: () => void = (): void => {
    log.addAutoEvent(autoClimb === 'checked');

    navigation.navigate('Endgame');
  };

  return (
    <Box>
      <HStack spacing={0} style={styles.buttonStack}>
        <Text variant="body1">Team: {assignment?.currentMatch.teamNum ?? ''}</Text>
        <RadioButton.Item
          label="Auto Climb"
          value="autoClimb"
          status={autoClimb}
          onPress={(): void => {
            setAutoClimb(autoClimb === 'unchecked' ? 'checked' : 'unchecked');
          }}
        />
        <Button variant="contained" title="Endgame" onPress={toEndgame} style={styles.button} />
        <ViewTimer />
      </HStack>
      <Box style={styles.images}>
        <Image
          alt="Reef"
          source={assignment.alliance === 'BLUE' ? blueFieldImage : redFieldImage}
          style={styles.field}
        />
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 120,
    marginTop: 10,
  },
  buttonStack: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'space-evenly',
    margin: 4,
  },
  field: {
    height: 495,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 400,
    transform: 'rotate(90deg)',
    transformOrigin: 'center center',
  },
  images: {
    marginTop: 10,
  },
});
