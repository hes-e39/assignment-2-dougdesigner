import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

const TimersView = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Timers</h1>
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
