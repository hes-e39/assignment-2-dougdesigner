import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

const TimersView = () => {
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between py-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Timers
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {/* <button
            type="button"
            className="inline-flex items-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
          >
            Edit
          </button> */}
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Add timer
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Stopwatch />
        <Countdown />
        <XY />
        <Tabata />
      </div>
    </div>
  );
};

export default TimersView;