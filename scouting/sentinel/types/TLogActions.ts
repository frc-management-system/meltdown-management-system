import {
  EEndgameLocation2026,
  EScoreLocation2026,
  ERating2026,
  EStartLocation2026,
  ETowerLevel2026,
} from '../../common/types/2026';

export type TLogActions = {
  addStartEvent: (location: EStartLocation2026, preloadFuel: number) => void;
  addScoreEvent: (
    location: EScoreLocation2026,
    rating: ERating2026,
    accuracy: number,
    duration: number
  ) => void;
  addPassingEvent: (rating: ERating2026, accuracy: number, duration: number) => void;
  addAutoEvent: (autoClimb: boolean) => void;
  addEndgameEvent: (
    location: EEndgameLocation2026,
    notes: string,
    defenseRating: number,
    towerLevel: ETowerLevel2026
  ) => void;
};
