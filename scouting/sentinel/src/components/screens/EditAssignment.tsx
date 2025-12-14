import React, { Dispatch, useState } from 'react';
import { Box, Button, Divider, HStack, Text, VStack } from '@react-native-material/core';
import { EAssignmentActionType, TAssignmentAction, TRootStackParamList } from '../../../types';
import { List, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAssignment, useAssignmentDispatch } from '../../contexts/AssignmentContext';
import { TAssignmentMatch } from '../../../../common/types';

export type PMatchLogsProps = NativeStackScreenProps<TRootStackParamList, 'MatchLogs'>;

export function EditAssignment({ navigation }: PMatchLogsProps): React.JSX.Element {
  const assignment = useAssignment();
  const [scouterName, setScouterName] = useState(assignment.currentMatch.scouter);
  const [selectedMatchNum, setSelectedMatchNum] = useState<number>(
    assignment.currentMatch.matchNum
  );
  const assignmentDispatch: Dispatch<TAssignmentAction> = useAssignmentDispatch();

  const onSave = (): void => {
    const action: TAssignmentAction = {
      type: EAssignmentActionType.edit,
      editData: {
        scouter: scouterName,
        matchNum: selectedMatchNum,
      },
    };

    assignmentDispatch(action);
    navigation.navigate('Prematch');
  };

  const onSelectMatch = (match: TAssignmentMatch) => {
    setSelectedMatchNum(match.matchNum);
    setScouterName(match.scouter ?? '');
  };

  const createMatchList: () => React.ReactNode = (): React.ReactNode => {
    return (
      <>
        {assignment.matches.map((match) => {
          const isSelected = match.matchNum === selectedMatchNum;

          return (
            <List.Item
              key={match.matchNum}
              title={`Match ${match.matchNum}`}
              onPress={() => onSelectMatch(match)}
              style={{
                backgroundColor: isSelected ? '#D3D3D3' : undefined,
                borderRadius: 8,
                marginBottom: 4,
              }}
              right={(props) => (isSelected ? <List.Icon {...props} icon="check" /> : null)}
            />
          );
        })}
      </>
    );
  };

  return (
    <Box style={{ flex: 1, margin: 10 }}>
      <Text variant="h4">Edit Assignment</Text>
      <Divider style={{ marginBottom: 10 }} />

      <VStack style={{ flex: 1 }} divider={<Divider />} spacing={5}>
        <Text variant="h6" style={{ marginTop: 10 }}>
          Matches
        </Text>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 10 }}>
          {createMatchList()}
        </ScrollView>
        <TextInput label="Scouter Name" value={scouterName} onChangeText={setScouterName} />
        <HStack spacing={50} style={{ marginTop: 10 }}>
          <Button
            title="Back"
            style={{ height: 38, width: 200 }}
            variant="contained"
            onPress={() => navigation.navigate('Prematch')}
          />
          <Button
            title="Save"
            style={{ height: 38, width: 200 }}
            variant="contained"
            onPress={onSave}
          />
        </HStack>
      </VStack>
    </Box>
  );
}
