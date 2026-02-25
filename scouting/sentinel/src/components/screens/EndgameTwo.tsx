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
import {
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { RadioButtonList } from '../basics/RadioButtonList';
import { EAssignmentActionType, TRootStackParamList } from '../../../types';
import { EEndgameLocation2026, ETowerLevel2026 } from '../../../../common/types/2026';
import { useLog, useSaveLog } from '../../contexts/LogContext';
import { useAssignmentDispatch } from '../../contexts/AssignmentContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import towerImage from '../../../assets/tower.png';

const windowDimensions = Dimensions.get('window');

export type PEndgameScreenProps = NativeStackScreenProps<TRootStackParamList, 'EndgameTwo'>;

export function EndgameTwo({
  route: {
    params: { fuelPlowRating, defenseRating, firingRating },
  },
  navigation,
}: PEndgameScreenProps): React.JSX.Element {
  const locations: EEndgameLocation2026[] = Object.values(EEndgameLocation2026);

  const [endPosPressed, setEndPosPressed] = useState(new Array(locations.length).fill(false));

  const [towerLevel, setTowerLevel] = useState<ETowerLevel2026>(ETowerLevel2026.none);

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

    log.addEndgameEvent(
      endPos,
      `\"${notes}\"`,
      +defenseRating,
      towerLevel,
      firingRating,
      fuelPlowRating
    );

    assignmentDispatch({
      type: EAssignmentActionType.nextMatch,
    });

    saveLog().then((path) => {
      navigation.navigate('QRShow', { routeName: 'Prematch', path });
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // On Android, passing undefined lets the OS use adjustResize naturally
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Box style={styles.autoContainer}>
          <Text variant="h4">Endgame</Text>
          <HStack spacing={2}>
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
            {towerLevel === ETowerLevel2026.none ? (
              <></>
            ) : (
              <Box>
                <Text variant="h6" style={{ marginTop: 10 }}>
                  Tower Position:
                </Text>
                <Image alt="Ending Position" source={towerImage} style={styles.endField} />

                {posStyles.map((style, i) => {
                  return (
                    <Pressable
                      key={i}
                      // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
                      style={{
                        ...style,
                        backgroundColor: endPosPressed[i] ? 'rgba(0,200,0,0.5)' : 'rgba(0,0,0,0)',
                      }}
                      onPress={() => {
                        const newArr = new Array(locations.length).fill(false);
                        newArr[i] = true;
                        setEndPosPressed(newArr);
                      }}
                    />
                  );
                })}
              </Box>
            )}
          </HStack>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const endAreaLeft = 12;
const endAreaTop = 50;
const styles = StyleSheet.create({
  endField: {
    height: 350,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 500,
    objectFit: 'fill',
  },
  autoContainer: {
    height: windowDimensions.height,
    width: windowDimensions.width,
  },
  button: {
    margin: 20,
    marginLeft: 350,
    width: 100,
  },
  textInput: {
    height: 180,
    margin: 4,
    width: 450,
  },
  none: {
    height: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 0,
  },
  leftPeg: {
    height: 350,
    left: endAreaLeft,
    position: 'absolute',
    top: endAreaTop,
    width: 90,
  },
  leftSide: {
    height: 225,
    left: endAreaLeft + 90,
    position: 'absolute',
    top: endAreaTop + 125,
    width: 100,
  },
  frontCenter: {
    height: 225,
    left: endAreaLeft + 190,
    position: 'absolute',
    top: endAreaTop + 125,
    width: 110,
  },
  backCenter: {
    height: 125,
    left: endAreaLeft + 90,
    position: 'absolute',
    top: endAreaTop,
    width: 310,
  },
  rightSide: {
    height: 225,
    left: endAreaLeft + 300,
    position: 'absolute',
    top: endAreaTop + 125,
    width: 100,
  },
  rightPeg: {
    height: 350,
    left: endAreaLeft + 400,
    position: 'absolute',
    top: endAreaTop,
    width: 100,
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
