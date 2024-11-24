import { createContext, useState, useContext, useEffect } from "react";

// Timer configuration types
export interface TimerConfig {
  id: string;
  type: "stopwatch" | "countdown" | "tabata" | "xy";
  workTime: { minutes: number; seconds: number };
  restTime?: { minutes: number; seconds: number }; // Optional, for Tabata and XY
  rounds?: number; // Optional, for Tabata and XY
  state: "not running" | "running" | "paused" | "completed";
  skipped: boolean; // Track if the timer was skipped
}

// Context State
interface WorkoutContextState {
  timers: TimerConfig[];
  currentTimerIndex: number | null; // Index of the active timer
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

  // Persist timers to localStorage
  useEffect(() => {
    localStorage.setItem("workoutTimers", JSON.stringify(timers));
  }, [timers]);

  // Add a new timer
  const addTimer = (timer: TimerConfig) => {
    setTimers((prevTimers) => [
      ...prevTimers,
      { ...timer, state: "not running", skipped: false },
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
          skipped: skip && index === currentTimerIndex ? true : timer.skipped, // Mark skipped
        }))
      );

      if (nextIndex < timers.length) {
        setCurrentTimerIndex(nextIndex);
      } else {
        // Mark the final timer as completed
        setCurrentTimerIndex(null); // Indicate that the workout is completed
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
    setCurrentTimerIndex(null);
    setTimers((prevTimers) =>
      prevTimers.map((timer) => ({
        ...timer,
        state: "not running",
        skipped: false, // Reset skipped status
      }))
    );
  };

  return (
    <WorkoutContext.Provider
      value={{
        timers,
        currentTimerIndex,
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