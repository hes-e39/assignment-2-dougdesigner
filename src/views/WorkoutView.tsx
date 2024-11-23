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

                {/* Timers List */}
                <ul role="list" className="divide-y divide-white/5 mt-6 w-full max-w-lg">
                {timers.length === 0 ? (
                    <p className="text-gray-500 text-center">No timers added yet.</p>
                ) : (
                    timers.map((timer, index) => (
                    <li
                        key={timer.id}
                        className="relative flex items-center space-x-4 py-4"
                    >
                        <div className="min-w-0 flex-auto">
                        <div className="flex items-center gap-x-3">
                            <div
                            className={`flex-none rounded-full p-1 ${
                                index === currentTimerIndex
                                ? "bg-green-400/10 text-green-400"
                                : timer.state === "completed"
                                ? "bg-gray-400/10 text-gray-400"
                                : "bg-gray-100/10 text-gray-500"
                            }`}
                            >
                            <div className="size-2 rounded-full bg-current"></div>
                            </div>
                            <h2 className="min-w-0 text-sm/6 font-semibold text-white">
                            {timer.type}
                            </h2>
                        </div>
                        <div className="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                            <p>
                            <strong>Work:</strong> {timer.workTime.minutes}m{" "}
                            {timer.workTime.seconds}s
                            </p>
                            {timer.restTime && (
                            <>
                                <svg
                                viewBox="0 0 2 2"
                                className="size-0.5 flex-none fill-gray-300"
                                >
                                <circle cx="1" cy="1" r="1" />
                                </svg>
                                <p>
                                <strong>Rest:</strong> {timer.restTime.minutes}m{" "}
                                {timer.restTime.seconds}s
                                </p>
                            </>
                            )}
                            {timer.rounds && (
                            <>
                                <svg
                                viewBox="0 0 2 2"
                                className="size-0.5 flex-none fill-gray-300"
                                >
                                <circle cx="1" cy="1" r="1" />
                                </svg>
                                <p>
                                <strong>Rounds:</strong> {timer.rounds}
                                </p>
                            </>
                            )}
                        </div>
                        </div>
                        <button
                        onClick={() => removeTimer(timer.id)}
                        className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Remove
                        </button>
                    </li>
                    ))
                )}
                </ul>

                {/* Workout Controls */}
                { timers.length > 0 && (
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
                )}
            </div>
        </div>
    );
};

export default WorkoutView;