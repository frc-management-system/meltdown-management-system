import React, { useState } from 'react';
import { Box, Text, Button, Pressable, HStack, Spacer } from '@react-native-material/core';
import { Image, StyleSheet } from 'react-native';
import { RadioButtonList } from '../basics/RadioButtonList';
import { ERobotState, TRootStackParamList } from '../../../types';
import { EStartLocation2025 } from '../../../../common/types/2025';
import blueAutoFieldImage from '../../../assets/blueAutoField.png';
import redAutoFieldImage from '../../../assets/redAutoField.png';
import { AssignmentTable } from '../tables/AssignmentTable';
import { useLog } from '../../contexts/LogContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAssignment } from '../../contexts/AssignmentContext';

export type PPrematchScreen = NativeStackScreenProps<TRootStackParamList, 'Prematch'>;

export function Prematch({ navigation }: PPrematchScreen): React.JSX.Element {
  const locations: EStartLocation2025[] = Object.values(EStartLocation2025);

  const [startPosPressed, setStartPosPressed] = useState(new Array(locations.length).fill(false));
  const [preload, setPreload] = useState(ERobotState.empty);
  const log = useLog();
  const assignment = useAssignment();

  const onEdit = () => {
    navigation.navigate('EditAssignment');
  }

  const onConfirm = () => {
    let startPos: EStartLocation2025 = EStartLocation2025.center;

    locations.forEach((location, i) => {
      if (startPosPressed[i]) {
        startPos = location;
      }
    });

    setStartPosPressed(new Array(locations.length).fill(false));
    setPreload(ERobotState.empty);

    log.addStartEvent(startPos);

    navigation.navigate('Teleop', { initialRobotState: preload });
  };

  return (
    <Box>
      <Text variant="h4">Pre-Match</Text>
      <HStack spacing={2}>
        <AssignmentTable />
        <Box>
          <Button title="Edit Assignment" onPress={onEdit}/>
          <Box style={styles.form}>
            <Text variant="h6">Pre-Load:</Text>
            <RadioButtonList
              direction="row"
              labels={[ERobotState.coral, ERobotState.empty]}
              selected={preload}
              setSelected={(value: ERobotState) => setPreload(value)}
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
              backgroundColor: startPosPressed[i] ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
            }}
            onPress={() => {
              const newArr = new Array(3).fill(false);
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
  },
  confirm: {
    position: 'absolute',
    top: 510,
    marginLeft: 12,
    width: 1000,
  },
  form: {
    marginLeft: 50,
    marginTop: 80,
  },
  left: {
    height: 225,
    left: autoAreaLeft,
    position: 'absolute',
    top: autoAreaTop,
    width: 333,
  },
  center: {
    height: 225,
    left: autoAreaLeft + 333,
    position: 'absolute',
    top: autoAreaTop,
    width: 333,
  },
  right: {
    height: 225,
    left: autoAreaLeft + 666,
    position: 'absolute',
    top: autoAreaTop,
    width: 333,
  },
});
const posStyles = [styles.left, styles.center, styles.right];
