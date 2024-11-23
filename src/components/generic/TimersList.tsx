import React from "react";
import { useNavigate } from "react-router-dom";
import { TimerConfig } from "../../context/WorkoutContext";
import EmptyState from "../generic/EmptyState";

interface TimersListProps {
  timers: TimerConfig[];
  currentTimerIndex?: number | null;
  onRemoveTimer?: (id: string) => void;
}

const TimersList: React.FC<TimersListProps> = ({
  timers,
  currentTimerIndex = null,
  onRemoveTimer,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-lg mt-6">
      {timers.length === 0 ? (
        <EmptyState
          title="No timers"
          description="Get started by adding a new timer to your workout."
          buttonText="New timer"
          onButtonClick={() => navigate("/add")} // Navigate to the Add Timer view
        />
      ) : (
        <ul role="list" className="divide-y divide-white/5">
          {timers.map((timer, index) => (
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
                        ? "bg-blue-400/10 text-blue-400"
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
                    <strong>Work</strong> {timer.workTime.minutes}m{" "}
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
                        <strong>Rest</strong> {timer.restTime.minutes}m{" "}
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
                        <strong>Rounds</strong> {timer.rounds}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {onRemoveTimer && (
                <button
                  onClick={() => onRemoveTimer(timer.id)}
                  className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimersList;