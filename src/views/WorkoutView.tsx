import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import Button from "../components/generic/Button";
import TimersList from "../components/generic/TimersList";
import WorkoutStats from "../components/generic/WorkoutStats";

const WorkoutView = () => {
  const {
    timers,
    currentTimerIndex,
    removeTimer,
    startWorkout,
    nextTimer,
    resetWorkout,
    pauseTimer,
  } = useWorkout();

  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in milliseconds
  const [isWorkoutEditable, setIsWorkoutEditable] = useState(true); // Track if workout is editable
//   const [skippedTimers, setSkippedTimers] = useState<Set<number>>(new Set()); // Track skipped timers

  const isWorkoutPaused =
    currentTimerIndex !== null && timers[currentTimerIndex]?.state === "paused";
  const isWorkoutRunning =
    currentTimerIndex !== null && timers[currentTimerIndex]?.state === "running";
  const isWorkoutActive = isWorkoutPaused || isWorkoutRunning;

  // Track if the workout has been completed
  const isWorkoutCompleted = timers.every((timer) => timer.state === "completed");

  // Calculate total workout time
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

  // Automatically transition to the next timer when the current one completes
  useEffect(() => {
    if (!isWorkoutRunning || currentTimerIndex === null) return;

    const currentTimer = timers[currentTimerIndex];
    const workTime = currentTimer.workTime.minutes * 60 + currentTimer.workTime.seconds;
    const restTime = currentTimer.restTime
      ? currentTimer.restTime.minutes * 60 + currentTimer.restTime.seconds
      : 0;

    const totalTimeForOneRound = workTime + restTime;
    const timerDuration = totalTimeForOneRound * 1000; // Total duration in milliseconds

    const timeout = setTimeout(() => {
      if (!isWorkoutPaused) {
        nextTimer(); // Move to the next timer only if not paused
      }
    }, timerDuration);

    return () => clearTimeout(timeout);
  }, [currentTimerIndex, isWorkoutRunning, isWorkoutPaused, timers, nextTimer]);

  // Update elapsed time when workout is running
  useEffect(() => {
    let interval: number | null = null;

    if (isWorkoutRunning) {
      interval = window.setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 10);
      }, 10); // Increment elapsed time by 10 milliseconds
    } else if (!isWorkoutRunning && elapsedTime !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutRunning]);

  // Calculate current and total rounds for the active timer
// const currentRounds =
//     currentTimerIndex !== null && timers[currentTimerIndex]?.rounds
//         ? {
//                 current: Math.floor(
//                     elapsedTime / (timers[currentTimerIndex].workTime.minutes * 60 * 1000 +
//                         timers[currentTimerIndex].workTime.seconds * 1000 +
//                         (timers[currentTimerIndex].restTime?.minutes || 0) * 60 * 1000 +
//                         (timers[currentTimerIndex].restTime?.seconds || 0) * 1000)
//                 ) + 1,
//                 total: timers[currentTimerIndex]?.rounds,
//             }
//         : { current: 1, total: 1 };

  // Handle workout start
  const handleStartWorkout = () => {
    setIsWorkoutEditable(false); // Disable editing after starting the workout
    startWorkout();
  };

  // Reset elapsed time and skipped timers when workout is reset
  const handleResetWorkout = () => {
    setElapsedTime(0); // Reset elapsed time
    // setSkippedTimers(new Set()); // Reset skipped timers
    setIsWorkoutEditable(true); // Re-enable editing after reset
    resetWorkout();
  };

  // Handle skipping a timer
  const handleSkipTimer = () => {
    if (currentTimerIndex !== null) {
    //   setSkippedTimers((prevSkippedTimers) => new Set(prevSkippedTimers).add(currentTimerIndex));
      nextTimer(true); // Mark the current timer as skipped
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between py-8 px-2">
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-white truncate text-3xl tracking-tight">
            Workout
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {/* Button to add a new timer */}
          <NavLink
            to="/add"
            className={`ml-3 inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              !isWorkoutEditable
                ? "cursor-not-allowed bg-slate-800 focus-visible:outline-slate-800"
                : "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
            }`}
            aria-disabled={!isWorkoutEditable}
            tabIndex={!isWorkoutEditable ? -1 : 0}
            onClick={(e) => {
                if (!isWorkoutEditable) {
                    e.preventDefault(); // Prevent navigation
                }
            }}
          >
            Add timer
          </NavLink>
        </div>
      </div>

      {timers.length > 0 && (
        <div className="flex flex-col items-center">
          <WorkoutStats
            totalWorkoutTime={totalWorkoutTime}
            elapsedTime={elapsedTime}
            currentTimer={currentTimerIndex !== null ? currentTimerIndex + 1 : 0}
            totalTimers={timers.length}
            isWorkPeriod={isWorkoutActive}
            // currentRounds={currentRounds} // Pass current rounds
          />


          {/* Current Timer Component from components/timers */}
          <div></div>

          {/* Workout Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="flex flex-col w-full space-y-4">
              <Button type="reset" onClick={handleResetWorkout} />
            </div>
            <div className="flex flex-col w-full space-y-4">
              {!isWorkoutActive && (
                <Button
                  type="start"
                  onClick={handleStartWorkout}
                  disabled={isWorkoutCompleted}
                />
              )}
              {isWorkoutRunning && <Button type="pause" onClick={pauseTimer} />}
              {isWorkoutPaused && <Button type="resume" onClick={startWorkout} />}
            </div>
            <div className="flex flex-col w-full space-y-4">
              <Button
                type="fastforward"
                onClick={handleSkipTimer}
                disabled={isWorkoutCompleted || !isWorkoutActive}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center mb-8">
        <TimersList
          timers={timers}
          currentTimerIndex={currentTimerIndex}
          onRemoveTimer={removeTimer}
          disableRemove={!isWorkoutEditable}
        />
      </div>
    </div>
  );
};

export default WorkoutView;