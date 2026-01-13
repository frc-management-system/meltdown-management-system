import React, { useState } from 'react';
import {
  VStack,
  TextInput,
  HStack,
  Text,
  Button,
  Box,
  Divider,
  Pressable,
} from '@react-native-material/core';
import { Image, StyleSheet, Dimensions } from 'react-native';
import { RadioButtonList } from '../basics/RadioButtonList';
import { EAssignmentActionType, TRootStackParamList } from '../../../types';
import { EEndgameLocation2026, ETowerLevel2026 } from '../../../../common/types/2026';
import { useLog, useSaveLog } from '../../contexts/LogContext';
import { useAssignmentDispatch } from '../../contexts/AssignmentContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import towerImage from '../../../assets/tower.png';

const windowDimensions = Dimensions.get('window');

export type PEndgameScreenProps = NativeStackScreenProps<TRootStackParamList, 'Endgame'>;

export function Endgame({ navigation }: PEndgameScreenProps): React.JSX.Element {
  const locations: EEndgameLocation2026[] = Object.values(EEndgameLocation2026);

  const [endPosPressed, setEndPosPressed] = useState(new Array(locations.length).fill(false));

  const [towerLevel, setTowerLevel] = useState<ETowerLevel2026>(ETowerLevel2026.none);
  const [defenseRating, setDefenseRating] = useState<string>('0');

  const [notes, setNotes] = useState('');

  const log = useLog();
  const saveLog = useSaveLog();

  const assignmentDispatch = useAssignmentDispatch();

  const onSubmit = () => {
    let endPos: EEndgameLocation2026 = EEndgameLocation2026.none;

    locations.forEach((location, i) => {
      if (endPosPressed[i]) {
        endPos = location;
      }
    });

    setEndPosPressed(new Array(locations.length).fill(false));

    log.addEndgameEvent(endPos, `\"${notes}\"`, +defenseRating, towerLevel);

    assignmentDispatch({
      type: EAssignmentActionType.nextMatch,
    });

    saveLog().then((path) => {
      navigation.navigate('QRShow', { routeName: 'Prematch', path });
    });
  };

  return (
    <Box style={styles.autoContainer}>
      <Text variant="h4">Endgame</Text>
      <VStack>
        <Text variant="h6">Tower:</Text>
        <RadioButtonList
          labels={Object.values(ETowerLevel2026)}
          direction="row"
          selected={towerLevel}
          setSelected={(value: ETowerLevel2026) => {
            setTowerLevel(value);
          }}
        />
        <Image alt="Ending Position" source={towerImage} style={styles.endField} />

        {posStyles.map((style, i) => {
          return (
            <Pressable
              key={i}
              // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
              style={{
                ...style,
                backgroundColor: endPosPressed[i] ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
              }}
              onPress={() => {
                const newArr = new Array(3).fill(false);
                newArr[i] = true;
                setEndPosPressed(newArr);
              }}
            />
          );
        })}
        <Divider />
        <Text variant="h6">Defense Rating:</Text>
        <RadioButtonList
          labels={Array.from({ length: 6 }, (_, i) => `${i}`)}
          direction="row"
          selected={defenseRating}
          setSelected={(value: string) => {
            setDefenseRating(value);
          }}
        />
        <Divider />
        <TextInput
          label="Notes"
          variant="outlined"
          multiline={true}
          numberOfLines={20}
          textAlignVertical={'top'}
          style={styles.textInput}
          onChangeText={setNotes}
          value={notes}
        />
      </VStack>
      <HStack>
        <Button
          title="Submit"
          compact
          variant="contained"
          onPress={onSubmit}
          style={styles.button}
        />
      </HStack>
    </Box>
  );
}

const endAreaLeft = 12;
const endAreaTop = 280;
const styles = StyleSheet.create({
  endField: {
    height: 225,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 1000,
  },
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
  none: {
    height: 225,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 333,
  },
  leftPeg: {
    height: 225,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 333,
  },
  leftSide: {
    height: 225,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 333,
  },
  frontCenter: {
    height: 225,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 333,
  },
  backCenter: {
    height: 225,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 333,
  },
  rightSide: {
    height: 225,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 333,
  },
  rightPeg: {
    height: 225,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 333,
  },
});

const posStyles = [
  styles.none,
  styles.leftPeg,
  styles.leftSide,
  styles.frontCenter,
  styles.backCenter,
  styles.rightSide,
  styles.rightPeg,
];
