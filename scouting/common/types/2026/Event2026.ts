import { EEventTypes } from '..';
import { ETowerLevel2026 as ETowerLevel2026 } from './ETowerLevel2026';
import { EEndgameLocation2026 } from './EEndgameLocation2026';
import { ECapacity2026 } from './ECapacity2026';
import { EStartLocation2026 } from './EStartLocation2026';
import { ERating2026 } from './ERating2026';
import { EAccuracyPercent2026 } from './EAccuracyPercent2026';

class ClassEvent2026 {
  type?: EEventTypes = EEventTypes.start;
  timestamp?: number = 0;
  location?: EStartLocation2026 | EEndgameLocation2026 = EStartLocation2026.hub;
  capacity?: ECapacity2026 = ECapacity2026.hopper;
  towerLevel?: ETowerLevel2026 = ETowerLevel2026.none;
  fireRating?: ERating2026 = ERating2026.none;
  duration?: number = 0;
  preloadFuel?: number = 0;
  accuracy?: EAccuracyPercent2026 = EAccuracyPercent2026.onehundred;
  autoClimb?: boolean = false;
  notes?: string = '';
  defenseRating?: number = 0;
  fuelPlowRating?: ERating2026 = ERating2026.none;
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
