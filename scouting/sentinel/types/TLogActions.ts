import {
  EStartLocation2025,
  EPickupLocation2025,
  EScoreLocation2025,
} from '../../common/types/2025';
import { EEndgameLocation2026 } from '../../common/types/2026';
import { ERobotState } from './ERobotState';

export type TLogActions = {
  addStartEvent: (location: EStartLocation2025) => void;
  addPickupEvent: (location: EPickupLocation2025, gamepiece: ERobotState) => void;
  modifyLastPickupEvent: (location: EPickupLocation2025) => void;
  addDropEvent: (gamepiece: ERobotState) => void;
  addScoreEvent: (location: EScoreLocation2025) => void;
  miss: () => void;
  addAutoEvent: (leave: boolean) => void;
  addEndgameEvent: (location: EEndgameLocation2026, notes: string, defenseRating: number) => void;
};
