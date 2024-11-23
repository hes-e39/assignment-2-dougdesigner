import { NavLink } from 'react-router-dom';

const AddTimerView = () => {
    return (
    <div>
        <div className="md:flex md:items-center md:justify-between py-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Add timer
            </h2>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <NavLink
                to="/"
                className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
            >
                Cancel
            </NavLink>
            {/* After configuring a valid timer, the user confirms and the timer is added to the list. */}
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Save
            </button>
          </div>
        </div>

        {/* choose the type of timer and configure all inputs for that timer. allow the user to configure any of the four timers (stopwatch, countdown, XY, and tabata) */}
        <div className="flex flex-col items-center">
        </div>

    </div>
    );
};

export default AddTimerView;