import { createContext, useState, useContext } from "react";

// Timer configuration types
export interface TimerConfig {
    id: string;
    type: "stopwatch" | "countdown" | "tabata" | "xy";
    workTime: { minutes: number; seconds: number };
    restTime?: { minutes: number; seconds: number }; // Optional, for Tabata and XY
    rounds?: number; // Optional, for Tabata and XY
    state: "not running" | "running" | "completed";
}

// Context State
interface WorkoutContextState {
    timers: TimerConfig[];
    currentTimerIndex: number | null; // Index of the active timer
    addTimer: (timer: TimerConfig) => void;
    removeTimer: (id: string) => void;
    startWorkout: () => void;
    nextTimer: () => void;
    resetWorkout: () => void;
}

// Create Context
const WorkoutContext = createContext<WorkoutContextState | undefined>(undefined);

// Context Provider
interface WorkoutProviderProps {
    children: React.ReactNode;
}

export const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
    const [timers, setTimers] = useState<TimerConfig[]>([]);
    const [currentTimerIndex, setCurrentTimerIndex] = useState<number | null>(null);

    // Add a new timer
    const addTimer = (timer: TimerConfig) => {
        setTimers((prevTimers) => [...prevTimers, { ...timer, state: "not running" }]);
    };

    // Remove a timer by ID
    const removeTimer = (id: string) => {
        setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
    };

    // Start the workout
    const startWorkout = () => {
        if (timers.length > 0) {
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
    const nextTimer = () => {
        if (currentTimerIndex !== null && currentTimerIndex < timers.length - 1) {
            const nextIndex = currentTimerIndex + 1;
            setCurrentTimerIndex(nextIndex);
            setTimers((prevTimers) =>
                prevTimers.map((timer, index) => ({
                    ...timer,
                    state: index === nextIndex ? "running" : index < nextIndex ? "completed" : "not running",
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