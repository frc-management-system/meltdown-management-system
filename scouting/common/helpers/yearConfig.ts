import { TYearConfig } from '../types';
import { denseToEventKey2024, eventKeyToDense2024, eventKeys2024 } from '../types/2024';
import { denseToEventKey2025, eventKeyToDense2025, eventKeys2025 } from '../types/2025/Event2025';
import { denseToEventKey2026, eventKeyToDense2026, eventKeys2026 } from '../types/2026';

export const yearConfig: (version: string) => TYearConfig = (version: string): TYearConfig => {
  const year = version.substring(0, 4);

  switch (year) {
    case '2026':
      return {
        denseToEventKey: denseToEventKey2026,
        eventKeyToDense: eventKeyToDense2026,
        eventKeys: eventKeys2026,
      };
    case '2025':
      return {
        denseToEventKey: denseToEventKey2025,
        eventKeyToDense: eventKeyToDense2025,
        eventKeys: eventKeys2025,
      };
    case '2024':
      return {
        denseToEventKey: denseToEventKey2024,
        eventKeyToDense: eventKeyToDense2024,
        eventKeys: eventKeys2024,
      };
  }

  throw new Error(`Year ${year} is not supported`);
};
