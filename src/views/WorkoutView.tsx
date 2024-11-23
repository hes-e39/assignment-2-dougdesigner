import { NavLink } from "react-router-dom";
import Button from "../components/generic/Button";
import DisplayTime from "../components/generic/DisplayTime";

const WorkoutView = () => {
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
            <DisplayTime minutes={0} seconds={0} hundredths={0} />

            {/* List of timers to be run for a workout. User should be able to remove a timer */}
            <div className="flex flex-col items-center">
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                {/* Controls to reset the workout back to its initial state */}
                <div className="flex flex-col w-full space-y-4">
                    <Button type="reset" />
                </div>

                {/* Controls to Pause/Resume the workout */}
                <div className="flex flex-col w-full space-y-4">
                    <Button type="start" />
                    <Button type="resume" />
                    <Button type="pause" />
                </div>

                {/* Controls to "fast-forward" - ends the current running timer and moves onto the next one */}
                <div className="flex flex-col w-full space-y-4">
                    <Button type="fastforward" />
                </div>
            </div>

        </div>

    </div>
    );
};

export default WorkoutView;