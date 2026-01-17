import React, { useState } from 'react';
import { Box, Button, Divider, HStack, Pressable, Text, VStack } from '@react-native-material/core';
import { Image, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { EAccuracy, TLogActions, TRootStackParamList } from '../../../types';
import { TAssignment } from '../../../../common/types';
import blueFieldImage from '../../../assets/blueField.png';
import redFieldImage from '../../../assets/redField.png';
import { useAssignment } from '../../contexts/AssignmentContext';
import { ViewTimer } from '../basics/ViewTimer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLog } from '../../contexts/LogContext';
import { ButtonList } from '../basics/ButtonList';
import { ERating2026, EScoreLocation2026 } from '../../../../common/types/2026';
import { useTimer } from '../../hooks/Timer';

export type PTeleop = NativeStackScreenProps<TRootStackParamList, 'Teleop'>;

export function Teleop({ navigation }: PTeleop): React.JSX.Element {
  const [autoClimb, setAutoClimb] = useState<'checked' | 'unchecked'>('unchecked');
  const locations: EScoreLocation2026[] = Object.values(EScoreLocation2026);
  locations.push(EScoreLocation2026.trench);
  locations.push(EScoreLocation2026.midfield);
  const [scorePosPressed, setScorePosPressed] = useState(new Array(locations.length).fill(false));
  const [scoreLocation, setScoreLocation] = useState<EScoreLocation2026>();

  const [inCycle, setInCycle] = useState<boolean>(false);
  const [isScoring, setIsScoring] = useState<boolean>(false);
  const [currentRating, setCurrentRating] = useState<ERating2026>();
  const [selectedAccuracy, setSelectedAccuracy] = useState<keyof typeof EAccuracy>();

  const assignment: TAssignment = useAssignment();
  const log: TLogActions = useLog();
  const timer = useTimer();

  const startCycle: (key: keyof typeof ERating2026) => void = (key: keyof typeof ERating2026) => {
    setInCycle(true);
    setCurrentRating(ERating2026[key]);
    timer.start();
  };

  const startScoring: (key: keyof typeof ERating2026) => void = (key: keyof typeof ERating2026) => {
    setIsScoring(true);
    startCycle(key);
  };

  const startPassing: (key: keyof typeof ERating2026) => void = (key: keyof typeof ERating2026) => {
    setIsScoring(false);
    startCycle(key);
  };

  const cleanupCycle: () => void = () => {
    setCurrentRating(null);
    setIsScoring(false);
    setSelectedAccuracy(null);
    setInCycle(false);
    setScorePosPressed(new Array(locations.length).fill(false));
    setScoreLocation(null);
    timer.reset();
  };

  const endCycle: (scorePos: EScoreLocation2026, accuracy: keyof typeof EAccuracy) => void = (
    scorePos: EScoreLocation2026,
    accuracyKey: keyof typeof EAccuracy
  ) => {
    if (!currentRating || (!scorePos && isScoring) || !accuracyKey) {
      return;
    }

    let accuracy = 0;
    switch (accuracyKey) {
      case 'quarter':
        accuracy = 0.25;
        break;
      case 'half':
        accuracy = 0.5;
        break;
      case 'threeQuarter':
        accuracy = 0.75;
        break;
      case 'full':
        accuracy = 1;
    }

    if (isScoring) {
      log.addScoreEvent(scorePos, currentRating, accuracy, timer.getTimeSeconds());
    } else {
      log.addPassingEvent(currentRating, accuracy, timer.getTimeSeconds());
    }
    cleanupCycle();
  };

  const toEndgame: () => void = (): void => {
    log.addAutoEvent(autoClimb === 'checked');

    cleanupCycle();

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
        <HStack divider={<Divider />} spacing={20} style={{ marginLeft: 20 }}>
          <VStack spacing={5}>
            <Text variant="h6">Scoring:</Text>
            <ButtonList
              enumProp={ERating2026}
              onPress={startScoring}
              onPressOut={() => {
                timer.pause();
              }}
            />
          </VStack>
          <VStack spacing={5}>
            <Text variant="h6">Passing:</Text>
            <ButtonList
              enumProp={ERating2026}
              onPress={startPassing}
              onPressOut={() => {
                timer.pause();
              }}
            />
          </VStack>
          {inCycle && isScoring ? (
            <VStack>
              <Text variant="h6">Location:</Text>
              <Box style={{ width: 450 }}></Box>
            </VStack>
          ) : (
            <></>
          )}
          {inCycle ? (
            <VStack spacing={5}>
              <Text variant="h6">Accuracy:</Text>
              <ButtonList
                enumProp={EAccuracy}
                onPress={(key: keyof typeof EAccuracy) => {
                  setSelectedAccuracy(key);
                  endCycle(scoreLocation, key);
                }}
                selectedKey={selectedAccuracy}
              />
            </VStack>
          ) : (
            <></>
          )}
        </HStack>
        {inCycle && isScoring ? (
          <Image
            alt="Reef"
            source={assignment.alliance === 'BLUE' ? blueFieldImage : redFieldImage}
            style={styles.field}
          />
        ) : (
          <></>
        )}
        {inCycle && isScoring ? (
          posStyles.map((style, i) => {
            return (
              <Pressable
                key={i}
                // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
                style={{
                  ...style,
                  backgroundColor: scorePosPressed[i] ? 'rgba(0,200,0,0.5)' : 'rgba(0,0,0,0)',
                }}
                onPress={() => {
                  const newArr = new Array(locations.length).fill(false);
                  newArr[i] = true;
                  setScorePosPressed(newArr);

                  let scorePos: EScoreLocation2026 = null;

                  locations.forEach((location, i) => {
                    if (newArr[i]) {
                      scorePos = location;
                    }
                  });

                  setScoreLocation(scorePos);

                  endCycle(scorePos, selectedAccuracy);
                }}
              />
            );
          })
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}

const FieldAreaLeft = 351;
const FieldAreaTop = 47;
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
    left: 400,
    position: 'absolute',
    top: 0,
    width: 400,
    transform: [{ rotate: '-90deg' }],
    objectFit: 'fill',
  },
  images: {
    marginTop: 10,
  },
  leftTrench: {
    height: 100,
    left: FieldAreaLeft + 270,
    position: 'absolute',
    top: FieldAreaTop,
    width: 225,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  hub: {
    height: 200,
    left: FieldAreaLeft + 270,
    position: 'absolute',
    top: FieldAreaTop + 100,
    width: 225,
    backgroundColor: 'rgba(0, 255, 0, 0.5)',
  },
  midfield: {
    height: 300,
    left: FieldAreaLeft,
    position: 'absolute',
    top: FieldAreaTop,
    width: 270,
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  outpost: {
    height: 100,
    left: FieldAreaLeft,
    position: 'absolute',
    top: FieldAreaTop + 300,
    width: 150,
    backgroundColor: 'rgba(150, 0, 50, 0.5)',
  },
  rightTrench: {
    height: 100,
    left: FieldAreaLeft + 270,
    position: 'absolute',
    top: FieldAreaTop + 300,
    width: 225,
    backgroundColor: 'rgba(200, 100, 0, 0.5)',
  },
  midField2: {
    height: 100,
    left: FieldAreaLeft + 150,
    position: 'absolute',
    top: FieldAreaTop + 300,
    width: 120,
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
});

const posStyles = [
  styles.leftTrench,
  styles.midfield,
  styles.hub,
  styles.outpost,
  styles.rightTrench,
  styles.midField2,
];
