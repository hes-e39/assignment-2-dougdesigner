import { NavLink } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import Button from "../components/generic/Button";
import DisplayTime from "../components/generic/DisplayTime";
import TimersList from "../components/generic/TimersList"; // Ensure this path is correct or update it to the correct path

const WorkoutView = () => {
  const {
    timers,
    currentTimerIndex,
    removeTimer,
    startWorkout,
    nextTimer,
    resetWorkout,
  } = useWorkout();

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
            className="ml-3 inline-flex items-center rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add timer
          </NavLink>
        </div>
      </div>

      {timers.length > 0 && (
      <div className="flex flex-col items-center">
        {/* Total workout time */}
        
        <p className="text-lg text-slate-300 font-semibold text-center">
          Total workout time
        </p>
        <DisplayTime
          minutes={Math.floor(totalWorkoutTime / 60)}
          seconds={totalWorkoutTime % 60}
          hundredths={0} // Static, not applicable for this calculation
        />

        {/* Workout Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="flex flex-col w-full space-y-4">
                <Button type="reset" onClick={resetWorkout} />
            </div>
            <div className="flex flex-col w-full space-y-4">
                <Button type="start" onClick={startWorkout} />
                <Button type="resume" onClick={() => {}} />
                <Button type="pause" onClick={() => {}} />
            </div>
            <div className="flex flex-col w-full space-y-4">
                <Button type="fastforward" onClick={nextTimer} />
            </div>
        </div>
      </div>
        )}
        <div className="flex flex-col items-center">
            {/* Timers List */}
            <TimersList
            timers={timers}
            currentTimerIndex={currentTimerIndex}
            onRemoveTimer={removeTimer}
            />
        </div>
    </div>
  );
};

export default WorkoutView;