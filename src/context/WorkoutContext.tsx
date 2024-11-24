import { createContext, useState, useContext, useEffect } from "react";

// Timer configuration types
export interface TimerConfig {
  id: string;
  type: "stopwatch" | "countdown" | "tabata" | "xy";
  workTime: { minutes: number; seconds: number };
  restTime?: { minutes: number; seconds: number }; // Optional, for Tabata and XY
  rounds?: number; // Optional, for Tabata and XY
  currentRound?: number; // Optional, for Tabata and XY
  timerMode?: "work" | "rest"; // Optional, for Tabata and XY
  state: "not running" | "running" | "paused" | "completed";
  skipped: boolean; // Track if the timer was skipped
}

// Context State
interface WorkoutContextState {
  timers: TimerConfig[];
  currentTimerIndex: number | null; // Index of the active timer
  elapsedTime: number; // Elapsed time in milliseconds for active timer
  totalElapsedTime: number; // Total elapsed time for the workout
  totalWorkoutTime: number; // Total workout time in seconds
  isWorkoutEditable: boolean; // Track if the workout is editable
  addTimer: (timer: TimerConfig) => void;
  removeTimer: (id: string) => void;
  startWorkout: () => void;
  nextTimer: (skip?: boolean) => void; // Optional skip parameter
  resetWorkout: () => void;
  pauseTimer: () => void;
}

// Create Context
const WorkoutContext = createContext<WorkoutContextState | undefined>(
  undefined
);

// Context Provider
interface WorkoutProviderProps {
  children: React.ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({
  children,
}) => {
  const [timers, setTimers] = useState<TimerConfig[]>(() => {
    const savedTimers = localStorage.getItem("workoutTimers");
    return savedTimers ? JSON.parse(savedTimers) : [];
  });

  const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(
    null
  );

  const [elapsedTime, setElapsedTime] = useState<number>(0); // Elapsed time for active timer in milliseconds
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0); // Total elapsed time for the workout
  const [totalWorkoutTime, setTotalWorkoutTime] = useState<number>(0); // Total workout time in seconds 
  const [isWorkoutEditable, setIsWorkoutEditable] = useState<boolean>(true); // Track if workout is editable

  // Persist timers to localStorage
  useEffect(() => {
    localStorage.setItem("workoutTimers", JSON.stringify(timers));
  }, [timers]);

  // Automatically update `isWorkoutEditable` based on workout state
  useEffect(() => {
    const isEditable = timers.every((timer) => timer.state === "not running");
    setIsWorkoutEditable(isEditable);
  }, [timers]);

  // Automatically update elapsed time and total elapsed time when the workout is running
  useEffect(() => {
    let interval: number | null = null;

    if (
      currentTimerIndex !== null &&
      timers[currentTimerIndex]?.state === "running"
    ) {
      interval = window.setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 100);
        setTotalElapsedTime((prevTotalElapsedTime) => prevTotalElapsedTime + 100);
      }, 100);
    } else if (elapsedTime !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTimerIndex, timers, elapsedTime, totalElapsedTime]);

  // Automatically advance the timer when the current one is complete
  useEffect(() => {
    if (currentTimerIndex === null) return;

    const currentTimer = timers[currentTimerIndex];
    if (currentTimer?.state !== "running") return;

    const workTime =
      currentTimer.workTime.minutes * 60 + currentTimer.workTime.seconds;
    const restTime = currentTimer.restTime
      ? currentTimer.restTime.minutes * 60 + currentTimer.restTime.seconds
      : 0;

    const totalDuration = (workTime + restTime) * 1000; // Convert to milliseconds

    if (elapsedTime >= totalDuration) {
      nextTimer(); // Move to the next timer
      setElapsedTime(0); // Reset elapsed time for the next timer
    }
  }, [elapsedTime, currentTimerIndex, timers]);

  // Add a new timer
  const addTimer = (timer: TimerConfig) => {
    setTimers((prevTimers) => [
      ...prevTimers,
      { ...timer },
    ]);
  };

  // Remove a timer
  const removeTimer = (id: string) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
  };

  // Start or resume the workout
  const startWorkout = () => {
    if (
      currentTimerIndex !== null &&
      timers[currentTimerIndex]?.state === "paused"
    ) {
      // Resume the paused timer
      setTimers((prevTimers) =>
        prevTimers.map((timer, index) => ({
          ...timer,
          state: index === currentTimerIndex ? "running" : timer.state,
        }))
      );
    } else if (timers.length > 0) {
      // Start the workout from the beginning
      setIsWorkoutEditable(false);
      setCurrentTimerIndex(0);
      setTimers((prevTimers) =>
        prevTimers.map((timer, index) => ({
          ...timer,
          state: index === 0 ? "running" : "not running",
        }))
      );
    }
  };

  // Move to the next timer
  const nextTimer = (skip: boolean = false) => {
    if (currentTimerIndex !== null) {
      const nextIndex = currentTimerIndex + 1;
      setTimers((prevTimers) =>
        prevTimers.map((timer, index) => ({
          ...timer,
          state:
            index === nextIndex
              ? "running"
              : index < nextIndex
              ? "completed"
              : "not running",
          skipped: skip && index === currentTimerIndex ? true : timer.skipped,
        }))
      );

      if (nextIndex < timers.length) {
        setCurrentTimerIndex(nextIndex);
      } else {
        // Mark the final timer as completed
        setCurrentTimerIndex(null);
      }
    }
  };

  // Pause the current timer
  const pauseTimer = () => {
    if (currentTimerIndex !== null) {
      setTimers((prevTimers) =>
        prevTimers.map((timer, index) => ({
          ...timer,
          state: index === currentTimerIndex ? "paused" : timer.state,
        }))
      );
    }
  };

  // Reset the workout
  const resetWorkout = () => {
    setElapsedTime(0); // Reset elapsed time
    setTotalElapsedTime(0); // Reset total elapsed time
    setIsWorkoutEditable(true); // Re-enable editing after reset
    setCurrentTimerIndex(null);
    setTimers((prevTimers) =>
      prevTimers.map((timer) => ({
        ...timer,
        state: "not running",
        skipped: false, // Reset skipped status
      }))
    );
  };

  // Calculate total workout time
  useEffect(() => {
    const totalWorkoutTime = timers.reduce((total, timer) => {
      const workTime = timer.workTime.minutes * 60 + timer.workTime.seconds;
      const restTime = timer.restTime
        ? timer.restTime.minutes * 60 + timer.restTime.seconds
        : 0;
      const totalTimePerRound = workTime + restTime;
      const totalTime = timer.rounds
        ? totalTimePerRound * timer.rounds
        : totalTimePerRound;
      return total + totalTime;
    }, 0);
    setTotalWorkoutTime(totalWorkoutTime);
  }, [timers]);
  

  return (
    <WorkoutContext.Provider
      value={{
        timers,
        currentTimerIndex,
        elapsedTime,
        totalElapsedTime,
        totalWorkoutTime,
        isWorkoutEditable,
        addTimer,
        removeTimer,
        startWorkout,
        nextTimer,
        resetWorkout,
        pauseTimer,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom Hook
export const useWorkout = (): WorkoutContextState => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};