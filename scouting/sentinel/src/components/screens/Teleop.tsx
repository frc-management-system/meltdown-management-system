import React, { useRef, useState } from 'react';
import { Box, Button, Divider, HStack, Pressable, Text, VStack } from '@react-native-material/core';
import { GestureResponderEvent, Image, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { TLogActions, TRootStackParamList } from '../../../types';
import { TAssignment } from '../../../../common/types';
import blueFieldImage from '../../../assets/labeledBlueField.png';
import redFieldImage from '../../../assets/labeledRedField.png';
import { useAssignment } from '../../contexts/AssignmentContext';
import { ViewTimer } from '../basics/ViewTimer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLog } from '../../contexts/LogContext';
import { ButtonList } from '../basics/ButtonList';
import { ECapacity2026 } from '../../../../common/types/2026';
import { useTimer } from '../../contexts/TimerContext';
import fuelImage from '../../../assets/fuel.png';
import SoundPlayer from 'react-native-sound-player';
// import shootDing from '../../../assets/shootDing.mp3';


export type PTeleop = NativeStackScreenProps<TRootStackParamList, 'Teleop'>;

export function Teleop({ navigation }: PTeleop): React.JSX.Element {
  const [autoClimb, setAutoClimb] = useState<'checked' | 'unchecked'>('unchecked');

  const [selectedCapacity, setSelectedCapacity] = useState<keyof typeof ECapacity2026>(
    ECapacity2026.hopper
  );
  const startCycleTime = useRef<number>(0);
  const cycleDuration = useRef<number>(0);

  const [fuelIconVisible, setFuelIconVisible] = useState(false);
  const [FuelIconCoords, setFuelIconCoords] = useState({ x: 0, y: 0 });

  const assignment: TAssignment = useAssignment();
  const log: TLogActions = useLog();
  const timer = useTimer();

  const cleanupCycle: () => void = () => {
    cycleDuration.current = 0;
    startCycleTime.current = 0;
  };

  const showFuelIcon: (x: number, y: number) => void = (x: number, y: number): void => {
    setFuelIconVisible(true);
    const newFuelIconCoords = {
      x,
      y,
    };
    setFuelIconCoords(newFuelIconCoords);
  };

  const score: () => void = () => {
    console.log(cycleDuration);
    log.addScoreEvent(ECapacity2026[selectedCapacity], cycleDuration.current);
    cleanupCycle();
  };

  const pass: () => void = () => {
    console.log(cycleDuration);
    log.addPassingEvent(ECapacity2026[selectedCapacity], cycleDuration.current);
    cleanupCycle();
  };

  const toEndgame: () => void = (): void => {
    log.addAutoEvent(autoClimb === 'checked');

    cleanupCycle();

    navigation.navigate('EndgameOne');
  };

  const shootDing = require('../../../assets/shootDing.mp3');

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
        <HStack divider={<Divider />} spacing={20} style={{ marginLeft: 20 }}>
          <VStack spacing={5}>
            <Text variant="h6">Capacity:</Text>
            <ButtonList
              enumProp={ECapacity2026}
              onPress={(key: keyof typeof ECapacity2026) => {
                setSelectedCapacity(key);
              }}
              selectedKey={selectedCapacity}
            />
          </VStack>
        </HStack>
        <Image
          alt="Field"
          source={assignment.alliance === 'BLUE' ? blueFieldImage : redFieldImage}
          style={styles.field}
        />
        <Pressable
          style={styles.scorePressable}
          onPressIn={(event: GestureResponderEvent): void => {
            if (startCycleTime.current === 0) {
              startCycleTime.current = timer.getTimeSeconds();
            }
            const x: number = event.nativeEvent.locationX + styles.scorePressable.left;
            const y: number = event.nativeEvent.locationY;
            showFuelIcon(x - 25, y - 25);

// play sound
            try {
  // play the file tone.mp3
  SoundPlayer.playSoundFile("tone", "mp3");
            } catch (e) {
  console.log(`cannot play the sound file`, e)
}
      
          }}
          onPressOut={() => {
            cycleDuration.current += timer.getTimeSeconds() - startCycleTime.current;
            startCycleTime.current = 0;
            score();
            setTimeout((): void => setFuelIconVisible(false), 500);
          }}
          pressEffect={'none'}
        />
        <Pressable
          style={styles.passPressable}
          onPressIn={(event: GestureResponderEvent): void => {
            if (startCycleTime.current === 0) {
              startCycleTime.current = timer.getTimeSeconds();
            }
            const x: number = event.nativeEvent.locationX + styles.passPressable.left;
            const y: number = event.nativeEvent.locationY;
            showFuelIcon(x - 25, y - 25);
          }}
          onPressOut={() => {
            cycleDuration.current += timer.getTimeSeconds() - startCycleTime.current;
            startCycleTime.current = 0;
            pass();
            setTimeout((): void => setFuelIconVisible(false), 500);
          }}
          pressEffect={'none'}
        />
        {fuelIconVisible && (
          <Image
            alt="note"
            source={fuelImage}
            style={{
              ...styles.fuelIcon,
              left: FuelIconCoords.x,
              top: FuelIconCoords.y,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

const FieldAreaLeft = 150;
const FieldAreaTop = 10;
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
    height: 470,
    left: FieldAreaLeft,
    position: 'absolute',
    top: FieldAreaTop,
    width: 790,
    objectFit: 'fill',
  },
  images: {
    marginTop: 10,
  },
  fuelIcon: {
    resizeMode: 'stretch',
    position: 'absolute',
    height: 50,
    width: 50,
  },
  scorePressable: {
    height: 470,
    left: FieldAreaLeft,
    position: 'absolute',
    top: FieldAreaTop,
    width: 230,
    //backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  passPressable: {
    height: 470,
    left: FieldAreaLeft + 230,
    position: 'absolute',
    top: FieldAreaTop,
    width: 560,
    //backgroundColor: 'rgba(0, 255, 0, 0.5)',
  },
});
