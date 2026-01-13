import { EEventTypes } from '..';
import { ETowerLevel2026 as ETowerLevel2026 } from './ETowerLevel2026';
import { EEndgameLocation2026 } from './EEndgameLocation2026';
import { EPassingRating2026 } from './EPassingRating2026';
import { EPickupLocation2026 } from './EPickupLocation2026';
import { EScoreLocation2026 } from './EScoreLocation2026';
import { EStartLocation2026 } from './EStartLocation2026';
import { ERating2026 as ERating2026 } from '.';

class ClassEvent2026 {
  type?: EEventTypes = EEventTypes.start;
  timestamp?: number = 0;
  location?: EStartLocation2026 | EPickupLocation2026 | EScoreLocation2026 | EEndgameLocation2026;
  towerLevel?: ETowerLevel2026;
  rating?: ERating2026;
  duration?: number;
  preloadFuel?: number = 0;
  accuracy?: number = 0;
  autoClimb?: boolean = false;
  notes?: string = '';
  defenseRating?: number = 0;
}

export interface TEvent2026 extends ClassEvent2026 {}

export type TEventArray2026 = Array<keyof TEvent2026>;

export const eventKeys2026: TEventArray2026 = Object.keys(new ClassEvent2026()) as TEventArray2026;

export let eventKeyToDense2026: Partial<Record<keyof TEvent2026, string>> = {};
eventKeys2026.forEach((key: keyof TEvent2026, index: number) => {
  eventKeyToDense2026[key] = String.fromCharCode('a'.charCodeAt(0) + index);
});

export let denseToEventKey2026: Record<string, keyof TEvent2026> = {};
eventKeys2026.forEach((key: keyof TEvent2026, index: number) => {
  denseToEventKey2026[String.fromCharCode('a'.charCodeAt(0) + index)] = key;
});
