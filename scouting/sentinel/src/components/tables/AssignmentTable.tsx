import React, { useCallback, useMemo, useRef, useState } from 'react';
import { TAssignment } from '../../../../common/types';
import { useAssignment } from '../../contexts/AssignmentContext';
import { DataTable } from 'react-native-paper';
import { Box, Text, Button } from '@react-native-material/core';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

export function AssignmentTable(): React.JSX.Element {
  const [currentMatchNum, setCurrentMatchNum] = useState<number>(-1);

  const assignment: TAssignment = useAssignment();

  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );

  const onConfirm = () => {
    sheetRef.current.expand();
  };

  const scouterName: string = assignment?.currentMatch.scouter ?? '';
  const teamNum: number = assignment?.currentMatch.teamNum ?? 0;
  const matchNum: number = assignment?.currentMatch.matchNum ?? 0;
  const alliance: string = `${assignment.alliance} ${assignment.alliancePos}`;

  useFocusEffect(
    React.useCallback(() => {
      setCurrentMatchNum(assignment.currentMatch.matchNum);
    }, [assignment.currentMatch])
  );

  const renderItem = useCallback(
    ({ item }) => (
      <Box>
        <Text>{item}</Text>
      </Box>
    ),
    []
  );

  return (
    <>
      <DataTable style={styles.dataTable}>
        <DataTable.Row>
          <DataTable.Title>
            <Text>Scouter</Text>
          </DataTable.Title>
          <DataTable.Cell>
            <Text>{scouterName}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Title>
            <Text>Team #</Text>
          </DataTable.Title>
          <DataTable.Cell>
            <Text>{teamNum}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Title>
            <Text>Match #</Text>
          </DataTable.Title>
          <DataTable.Cell>
            <Text>{matchNum}</Text>
          </DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Title>
            <Text>Alliance Pos</Text>
          </DataTable.Title>
          <DataTable.Cell>
            <Text>{alliance}</Text>
          </DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <Button title="PRESS" variant="contained" onPress={onConfirm} />
      <BottomSheet ref={sheetRef} snapPoints={['50%']} enableDynamicSizing={false}>
        <BottomSheetFlatList data={data} keyExtractor={(i) => i} renderItem={renderItem} />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  dataTable: {
    width: 400,
  },
});
