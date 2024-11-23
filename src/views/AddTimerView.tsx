import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Stopwatch from '../components/timers/Stopwatch';
import Countdown from '../components/timers/Countdown';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';
import { useWorkout } from '../context/WorkoutContext';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for timers

const AddTimerView = () => {
  const { addTimer } = useWorkout(); // Use the custom hook to access the context
  const [timerType, setTimerType] = useState<string | null>(null);
  const [timerConfig, setTimerConfig] = useState<any>(null); // Store the configuration for the current timer
  const [isTimerValid, setIsTimerValid] = useState(false); // Track if the timer is valid

  const handleSave = () => {
    if (timerType && timerConfig && isTimerValid) {
      const timer = {
        id: uuidv4(), // Generate a unique ID for the timer
        type: timerType,
        ...timerConfig,
        state: 'not running',
      };
      addTimer(timer);
      alert('Timer added successfully!');
      resetForm();
    } else {
      alert('Configure a valid timer before saving.');
    }
  };

  const resetForm = () => {
    setTimerType(null);
    setTimerConfig(null);
    setIsTimerValid(false);
  };

  const initializeTimerConfig = (type: string) => {
    switch (type) {
      case 'Stopwatch':
        return { workTime: { minutes: 0, seconds: 0 } };
      case 'Countdown':
        return { workTime: { minutes: 0, seconds: 0 } };
      case 'Tabata':
        return {
          workTime: { minutes: 0, seconds: 0 },
          restTime: { minutes: 0, seconds: 0 },
          rounds: 1,
        };
      case 'XY':
        return { workTime: { minutes: 0, seconds: 0 }, rounds: 1 };
      default:
        return null;
    }
  };

  const handleTimerTypeChange = (type: string) => {
    setTimerType(type);
    setTimerConfig(initializeTimerConfig(type)); // Initialize default config
    setIsTimerValid(false); // Reset validity when timer type changes
  };

  const handleTimerChange = (config: any) => {
    setTimerConfig((prevConfig: any) => ({
      ...prevConfig,
      ...config, // Update only the changed fields
    }));
    setIsTimerValid(config.isValid); // Update validity
  };

  const renderTimerInputs = () => {
    switch (timerType) {
      case 'Stopwatch':
        return (
          <Stopwatch
            onChange={handleTimerChange}
            isWorkoutTimer={true}
          />
        );
      case 'Countdown':
        return (
          <Countdown
            onChange={handleTimerChange}
            isWorkoutTimer={true}
          />
        );
      case 'Tabata':
        return (
          <Tabata
            onChange={handleTimerChange}
            isWorkoutTimer={true}
          />
        );
      case 'XY':
        return (
          <XY
            onChange={handleTimerChange}
            isWorkoutTimer={true}
          />
        );
      default:
        return (
          <p className="text-slate-500 text-sm text-center">
            Configure a valid timer and save it to add it to your workout.
          </p>
        );
    }
  };

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
            className="inline-flex items-center rounded-full bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
          >
            Go to workout
          </NavLink>
          <button
            type="button"
            onClick={handleSave}
            disabled={!timerType || !isTimerValid} // Use isTimerValid for button state
            className={`ml-3 inline-flex items-center rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              !timerType || !isTimerValid
                ? 'cursor-not-allowed bg-slate-800 focus-visible:outline-slate-800'
                : 'bg-indigo-600  hover:bg-indigo-500  focus-visible:outline-indigo-600'
            }`}
          >
            Save timer
          </button>
        </div>
      </div>

      {/* Timer configuration */}
      <div className="flex flex-col items-center">
        <div className="mx-auto w-full max-w-xs">
          <div>
            <label
              htmlFor="timerType"
              className="block text-lg font-semibold text-white"
            >
              Timer
            </label>
            <select
              id="timerType"
              name="timerType"
              className="mt-1 mr-2 py-2 px-4 block w-full bg-gray-800 border-2 border-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xl"
              onChange={(e) => handleTimerTypeChange(e.target.value)}
              value={timerType || ''}
            >
              <option value="" disabled>
                Select a timer
              </option>
              <option value="Stopwatch">Stopwatch</option>
              <option value="Countdown">Countdown</option>
              <option value="Tabata">Tabata</option>
              <option value="XY">XY</option>
            </select>
          </div>
        </div>

        <div className="md:flex md:items-center md:justify-between py-8">
          {renderTimerInputs()}
        </div>
      </div>
    </div>
  );
};

export default AddTimerView;