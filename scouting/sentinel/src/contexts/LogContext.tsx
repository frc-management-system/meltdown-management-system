import React, { createContext, MutableRefObject, useContext, useRef } from 'react';
import { EEventTypes, TLog } from '../../../common/types';
import {
  EPickupLocation2025,
  EScoreLocation2025,
  EStartLocation2025,
} from '../../../common/types/2025';
import { useTimer } from './TimerContext';
import { useAssignment } from './AssignmentContext';
import { ERobotState, TLogActions } from '../../types';
import { useFileManager } from '../hooks/useFileManager';
import { EEndgameLocation2026, TEvent2026 } from '../../../common/types/2026';

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
    addStartEvent: (location: EStartLocation2025) => {
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
            timestamp: 0,
          },
        ],
      };

      timer.start();
    },
    addPickupEvent: (location: EPickupLocation2025, gamepiece: ERobotState) => {
      log.current.events.push({
        type: EEventTypes.pickup,
        location,
        gamepiece,
        timestamp: timer.getTimeSeconds(),
      });
    },
    modifyLastPickupEvent: (location: EPickupLocation2025) => {
      const idx = log.current.events.findLastIndex((event) => event.type === EEventTypes.pickup);
      if (idx !== -1) log.current.events[idx] = { ...log.current.events[idx], location };
    },
    addDropEvent: (gamepiece: ERobotState) => {
      log.current.events.push({
        type: EEventTypes.drop,
        gamepiece,
        timestamp: timer.getTimeSeconds(),
      });
    },
    addScoreEvent: (location: EScoreLocation2025) => {
      log.current.events.push({
        type: EEventTypes.score,
        location,
        timestamp: timer.getTimeSeconds(),
      });
    },
    miss: () => {
      const idx = log.current.events.findLastIndex((event) => event.type === EEventTypes.score);
      if (idx !== -1) log.current.events[idx].miss = true;
    },
    addAutoEvent: (leave: boolean) => {
      log.current.events.push({
        type: EEventTypes.auto,
        leave,
        timestamp: timer.getTimeSeconds(),
      });
    },
    addEndgameEvent: (location: EEndgameLocation2026, notes: string, defenseRating: number) => {
      log.current.events.push({
        type: EEventTypes.endgame,
        location,
        notes,
        defenseRating,
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
