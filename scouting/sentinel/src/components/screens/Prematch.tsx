import React, { useState } from 'react';
import { Box, Text, Button, Pressable, HStack, Spacer } from '@react-native-material/core';
import { Image, StyleSheet } from 'react-native';
import { RadioButtonList } from '../basics/RadioButtonList';
import { TRootStackParamList } from '../../../types';
import { EStartLocation2026 } from '../../../../common/types/2026';
import blueAutoFieldImage from '../../../assets/blueField.png';
import redAutoFieldImage from '../../../assets/redField.png';
import { AssignmentTable } from '../tables/AssignmentTable';
import { useLog } from '../../contexts/LogContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAssignment } from '../../contexts/AssignmentContext';

export type PPrematchScreen = NativeStackScreenProps<TRootStackParamList, 'Prematch'>;

export function Prematch({ navigation }: PPrematchScreen): React.JSX.Element {
  const locations: EStartLocation2026[] = Object.values(EStartLocation2026);

  const [startPosPressed, setStartPosPressed] = useState(new Array(locations.length).fill(false));
  const [preloadFuel, setPreloadFuel] = useState('8');
  const log = useLog();
  const assignment = useAssignment();

  const onEdit = () => {
    navigation.navigate('EditAssignment');
  };

  const onConfirm = () => {
    let startPos: EStartLocation2026 = EStartLocation2026.hub;

    locations.forEach((location, i) => {
      if (startPosPressed[i]) {
        startPos = location;
      }
    });

    setStartPosPressed(new Array(locations.length).fill(false));
    setPreloadFuel('0');
    log.addStartEvent(startPos, +preloadFuel);

    navigation.navigate('Teleop');
  };

  return (
    <Box>
      <Text variant="h4">Pre-Match</Text>
      <HStack spacing={2}>
        <AssignmentTable />
        <Box>
          <Button title="Edit Assignment" onPress={onEdit} />
          <Box style={styles.form}>
            <Text variant="h6">Fuel Pre-Load:</Text>
            <RadioButtonList
              direction="row"
              labels={['0', '1', '2', '3', '4', '5', '6', '7', '8']}
              selected={preloadFuel}
              setSelected={(value: string) => setPreloadFuel(value)}
            />
            <Text variant="h5">Press start location:</Text>
          </Box>
        </Box>
      </HStack>
      <Image
        alt="Starting position"
        source={assignment.alliance === 'BLUE' ? blueAutoFieldImage : redAutoFieldImage}
        style={styles.autoField}
      />

      {posStyles.map((style, i) => {
        return (
          <Pressable
            key={i}
            // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
            style={{
              ...style,
              backgroundColor: startPosPressed[i] ? 'rgba(0,200,0,0.5)' : 'rgba(0,0,0,0)',
            }}
            onPress={() => {
              const newArr = new Array(locations.length).fill(false);
              newArr[i] = true;
              setStartPosPressed(newArr);
            }}
          />
        );
      })}
      <Button title="START" variant="contained" style={styles.confirm} onPress={onConfirm} />
    </Box>
  );
}

const autoAreaLeft = 12;
const autoAreaTop = 280;
const styles = StyleSheet.create({
  autoField: {
    height: 225,
    left: autoAreaLeft,
    position: 'absolute',
    top: autoAreaTop,
    width: 1000,
    objectFit: 'fill',
  },
  confirm: {
    position: 'absolute',
    top: 510,
    marginLeft: 12,
    width: 1000,
  },
  form: {
    marginLeft: 50,
    marginTop: 30,
  },
  leftTrench: {
    height: 225,
    left: autoAreaLeft,
    position: 'absolute',
    top: autoAreaTop,
    width: 200,
  },
  leftBump: {
    height: 225,
    left: autoAreaLeft + 200,
    position: 'absolute',
    top: autoAreaTop,
    width: 200,
  },
  hub: {
    height: 225,
    left: autoAreaLeft + 400,
    position: 'absolute',
    top: autoAreaTop,
    width: 200,
  },
  rightBump: {
    height: 225,
    left: autoAreaLeft + 600,
    position: 'absolute',
    top: autoAreaTop,
    width: 200,
  },
  rightTrench: {
    height: 225,
    left: autoAreaLeft + 800,
    position: 'absolute',
    top: autoAreaTop,
    width: 200,
  },
});
const posStyles = [
  styles.leftBump,
  styles.leftTrench,
  styles.hub,
  styles.rightBump,
  styles.rightTrench,
];
