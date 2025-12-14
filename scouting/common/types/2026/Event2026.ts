import { EEventTypes } from '..';
import { ERobotState } from '../../../sentinel/types';
import { EEndgameLocation2026 } from './EEndgameLocation2026';
import { EPickupLocation2026 } from './EPickupLocation2026';
import { EScoreLocation2026 } from './EScoreLocation2026';
import { EStartLocation2026 } from './EStartLocation2026';

class ClassEvent2026 {
  type?: EEventTypes = EEventTypes.start;
  timestamp?: number = 0;
  location?: EStartLocation2026 | EPickupLocation2026 | EScoreLocation2026 | EEndgameLocation2026;
  gamepiece?: ERobotState = ERobotState.empty;
  miss?: boolean = false;
  leave?: boolean = false;
  notes?: string = '';
  clearAlgae?: number = 0;
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
