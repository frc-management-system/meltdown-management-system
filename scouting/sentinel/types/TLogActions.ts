import {
  ECapacity2026,
  EEndgameLocation2026,
  ERating2026,
  EStartLocation2026,
  ETowerLevel2026,
} from '../../common/types/2026';

export type TLogActions = {
  addStartEvent: (location: EStartLocation2026, preloadFuel: number) => void;
  addScoreEvent: (capacity: ECapacity2026, duration: number) => void;
  addPassingEvent: (capacity: ECapacity2026, duration: number) => void;
  addAutoEvent: (autoClimb: boolean) => void;
  addEndgameEvent: (
    location: EEndgameLocation2026,
    notes: string,
    defenseRating: number,
    towerLevel: ETowerLevel2026,
    rating: ERating2026,
    accuracy: ERating2026
  ) => void;
};
