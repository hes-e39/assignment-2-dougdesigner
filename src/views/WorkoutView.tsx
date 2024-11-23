import { NavLink } from "react-router-dom";
import { useWorkout } from "../context/WorkoutContext";
import Button from "../components/generic/Button";
import DisplayTime from "../components/generic/DisplayTime";

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
        const totalTime = timer.rounds ? totalTimePerRound * timer.rounds : totalTimePerRound;
        return total + totalTime;
    }, 0);

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between py-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
                        Workout
                    </h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    {/* A button to "Add" a new timer. This button brings the user to the /add screen */}
                    <NavLink
                        to="/add"
                        className="ml-3 inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        Add
                    </NavLink>
                </div>
            </div>

            <div className="flex flex-col items-center">
                {/* The total time the workout will take */}
                <DisplayTime
                    minutes={Math.floor(totalWorkoutTime / 60)}
                    seconds={totalWorkoutTime % 60}
                    hundredths={0} // Static, not applicable for this calculation
                />

                {/* List of timers to be run for a workout. User should be able to remove a timer */}
                <div className="flex flex-col items-center w-full mt-4">
                    {timers.length === 0 ? (
                        <p className="text-gray-500">No timers added yet.</p>
                    ) : (
                        <ul className="space-y-2 w-full max-w-lg">
                            {timers.map((timer, index) => (
                                <li
                                    key={timer.id}
                                    className={`p-4 border rounded-md ${
                                        index === currentTimerIndex
                                            ? "bg-green-100"
                                            : timer.state === "completed"
                                            ? "bg-gray-100"
                                            : "bg-white"
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p>
                                                <strong>Type:</strong> {timer.type}
                                            </p>
                                            <p>
                                                <strong>Work:</strong> {timer.workTime.minutes}m{" "}
                                                {timer.workTime.seconds}s
                                            </p>
                                            {timer.restTime && (
                                                <p>
                                                    <strong>Rest:</strong>{" "}
                                                    {timer.restTime.minutes}m {timer.restTime.seconds}s
                                                </p>
                                            )}
                                            {timer.rounds && (
                                                <p>
                                                    <strong>Rounds:</strong> {timer.rounds}
                                                </p>
                                            )}
                                            <p>
                                                <strong>State:</strong> {timer.state}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeTimer(timer.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Workout Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    {/* Reset Workout */}
                    <div className="flex flex-col w-full space-y-4">
                        <Button type="reset" onClick={resetWorkout} />
                    </div>

                    {/* Pause/Resume/Start Workout */}
                    <div className="flex flex-col w-full space-y-4">
                        <Button type="start" onClick={startWorkout} />
                        <Button type="resume" onClick={() => {}} />
                        <Button type="pause" onClick={() => {}} />
                    </div>

                    {/* Fast-Forward */}
                    <div className="flex flex-col w-full space-y-4">
                        <Button type="fastforward" onClick={nextTimer} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutView;