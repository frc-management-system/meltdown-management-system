import { useState, useCallback } from 'react';

export const useTimer = () => {
  // startTime: the timestamp (in seconds) when the timer was last resumed
  const [startTime, setStartTime] = useState<number | null>(null);
  // accumulatedTime: the total duration (in seconds) from all previous sessions
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  const isRunning = startTime !== null;

  /**
   * Calculates the current total elapsed time.
   */
  const getTimeSeconds = useCallback((): number => {
    let currentSession = 0;
    if (isRunning && startTime) {
      currentSession = Date.now() / 1000 - startTime;
    }
    const total = currentSession + accumulatedTime;
    // Round to 2 decimal places to avoid floating point issues
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [isRunning, startTime, accumulatedTime]);

  const start = useCallback((): void => {
    if (!isRunning) {
      setStartTime(Date.now() / 1000);
    }
  }, [isRunning]);

  const pause = useCallback((): void => {
    if (isRunning && startTime) {
      const sessionDuration = Date.now() / 1000 - startTime;
      setAccumulatedTime((prev) => prev + sessionDuration);
      setStartTime(null);
    }
  }, [isRunning, startTime]);

  const reset = useCallback((): void => {
    setStartTime(null);
    setAccumulatedTime(0);
  }, []);

  return {
    getTimeSeconds,
    start,
    pause,
    reset,
    isRunning,
  };
};
