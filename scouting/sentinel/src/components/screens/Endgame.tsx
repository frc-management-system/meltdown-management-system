import React, { useState } from 'react';
import { VStack, TextInput, HStack, Text, Button, Box, Divider } from '@react-native-material/core';
import { StyleSheet, Dimensions } from 'react-native';
import { RadioButtonList } from '../basics/RadioButtonList';
import { EAssignmentActionType, TRootStackParamList } from '../../../types';
import { EEndgameLocation2026 } from '../../../../common/types/2026';
import { useLog, useSaveLog } from '../../contexts/LogContext';
import { useAssignmentDispatch } from '../../contexts/AssignmentContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const windowDimensions = Dimensions.get('window');

export type PEndgameScreenProps = NativeStackScreenProps<TRootStackParamList, 'Endgame'>;

export function Endgame({ navigation }: PEndgameScreenProps): React.JSX.Element {
  const [endgameLocation, setEndgameLocation] = useState<EEndgameLocation2026>(
    EEndgameLocation2026.none
  );
  const [defenseRating, setDefenseRating] = useState<string>('0');

  const [notes, setNotes] = useState('');

  const log = useLog();
  const saveLog = useSaveLog();

  const assignmentDispatch = useAssignmentDispatch();

  const onSubmit = () => {
    log.addEndgameEvent(endgameLocation, `\"${notes}\"`, +defenseRating);

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
          labels={Object.values(EEndgameLocation2026)}
          direction="row"
          selected={endgameLocation}
          setSelected={(value: EEndgameLocation2026) => {
            setEndgameLocation(value);
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
