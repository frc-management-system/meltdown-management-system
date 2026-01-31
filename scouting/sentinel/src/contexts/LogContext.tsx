import React, { createContext, MutableRefObject, useContext, useRef } from 'react';
import { EEventTypes, TLog } from '../../../common/types';
import { useTimer } from './TimerContext';
import { useAssignment } from './AssignmentContext';
import { TLogActions } from '../../types';
import { useFileManager } from '../hooks/useFileManager';
import {
  EEndgameLocation2026,
  ERating2026,
  EStartLocation2026,
  ETowerLevel2026,
  TEvent2026,
  ECapacity2026,
} from '../../../common/types/2026';

const logDefault: TLog<TEvent2026> = {
  teamNum: 0,
  matchNum: 0,
  scouter: '',
  alliance: 'RED',
  alliancePos: '1',
  events: [],
};

const LogContext: React.Context<MutableRefObject<TLog<TEvent2026>>> =
  createContext<MutableRefObject<TLog<TEvent2026>>>(null);

export const useSaveLog: () => () => Promise<string> = (): (() => Promise<string>) => {
  const log = useContext<MutableRefObject<TLog<TEvent2026>>>(LogContext);
  const fileManager = useFileManager();

  return async () => {
    return fileManager.saveLog<TEvent2026>(log.current);
  };
};

export const useLog: () => TLogActions = (): TLogActions => {
  const log = useContext<MutableRefObject<TLog<TEvent2026>>>(LogContext);
  const assignment = useAssignment();
  const timer = useTimer();

  return {
    addStartEvent: (location: EStartLocation2026, preloadFuel: number) => {
      log.current = {
        teamNum: assignment.currentMatch.teamNum,
        matchNum: assignment.currentMatch.matchNum,
        scouter: assignment.currentMatch.scouter,
        alliance: assignment.alliance,
        alliancePos: assignment.alliancePos,
        events: [
          {
            type: EEventTypes.start,
            location,
            preloadFuel,
            timestamp: 0,
          },
        ],
      };

      timer.start();
    },
    addScoreEvent: (capacity: ECapacity2026, duration: number) => {
      log.current.events.push({
        type: EEventTypes.score,
        capacity,
        duration,
        timestamp: timer.getTimeSeconds(),
      });
    },
    addPassingEvent: (capacity: ECapacity2026, duration: number) => {
      log.current.events.push({
        type: EEventTypes.pass,
        capacity,
        duration,
        timestamp: timer.getTimeSeconds(),
      });
    },
    addAutoEvent: (autoClimb: boolean) => {
      log.current.events.push({
        type: EEventTypes.auto,
        autoClimb,
        timestamp: timer.getTimeSeconds(),
      });
    },
    addEndgameEvent: (
      location: EEndgameLocation2026,
      notes: string,
      defenseRating: number,
      towerLevel: ETowerLevel2026,
      rating: ERating2026,
      accuracy: ERating2026
    ) => {
      log.current.events.push({
        type: EEventTypes.endgame,
        location,
        notes,
        defenseRating,
        towerLevel,
        fireRating: rating,
        accuracy,
        timestamp: timer.getTimeSeconds(),
      });
      console.log(log.current);
    },
  };
};

export function LogProvider({ children }: React.PropsWithChildren) {
  const log = useRef<TLog<TEvent2026>>(logDefault);

  return <LogContext.Provider value={log}>{children}</LogContext.Provider>;
}
