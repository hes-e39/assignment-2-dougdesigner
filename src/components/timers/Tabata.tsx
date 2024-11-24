import Button from '../generic/Button';
import DisplayMode from '../generic/DisplayMode';
import DisplayRounds from '../generic/DisplayRounds';
import DisplayTime from '../generic/DisplayTime';
import Panel from '../generic/Panel';
import TabataInputs from '../generic/TabataInputs';

import { useEffect, useRef, useState } from 'react';
import { getMinutes, getSeconds, getHundredths } from '../../utils/helpers';

interface TabataProps {
  onChange?: (config: { 
    workTime: { minutes: number; seconds: number };
    restTime: { minutes: number; seconds: number };
    rounds: number;
    isValid: boolean;
  }) => void;
  isWorkoutTimer?: boolean; // Determines if this is used in a workout
}

const Tabata: React.FC<TabataProps> = ({ onChange, isWorkoutTimer = false }) => {
  const [inputWorkMinutes, setInputWorkMinutes] = useState(0);
  const [inputWorkSeconds, setInputWorkSeconds] = useState(0);
  const [inputRestMinutes, setInputRestMinutes] = useState(0);
  const [inputRestSeconds, setInputRestSeconds] = useState(0);
  const [rounds, setRounds] = useState(1);
  const [totalMilliseconds, setTotalMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const currentRoundRef = useRef<number>(1);
  const intervalRef = useRef<number | null>(null);
  const [timerMode, setTimerMode] = useState<'work' | 'rest'>('work');

  const workMilliseconds = inputWorkMinutes * 60000 + inputWorkSeconds * 1000;
  const restMilliseconds = inputRestMinutes * 60000 + inputRestSeconds * 1000;
  const targetMilliseconds = timerMode === 'work' ? workMilliseconds : restMilliseconds;

  // Reset timer function
  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(false);
    currentRoundRef.current = 1;
    setTimerMode('work');
    setTotalMilliseconds(targetMilliseconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Countdown function
  const tick = () => {
    setTotalMilliseconds((prevMilliseconds) => {
      if (prevMilliseconds > 0) {
        return prevMilliseconds - 10;
      } else {
        return 0; // Return 0 to stop the countdown
      }
    });
  };

  // Watch for when the timer reaches zero and handle round changes
  useEffect(() => {
    if (isRunning && totalMilliseconds === 0) {
      if (timerMode === 'work') {
        setTimerMode('rest');
        setTotalMilliseconds(restMilliseconds);
      } else {
        if (currentRoundRef.current < rounds) {
          currentRoundRef.current += 1;
          setTimerMode('work');
          setTotalMilliseconds(workMilliseconds); // Reset timer for the next round
        } else {
          // If all rounds are complete, stop the timer
          fastForwardTimer();
        }
      }
    }
  }, [totalMilliseconds, isRunning, rounds, workMilliseconds, restMilliseconds, timerMode]);

  // Start timer function
  const startTimer = () => {
    currentRoundRef.current = 1;
    setTimerMode('work');
    setTotalMilliseconds(workMilliseconds);
    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);
    intervalRef.current = window.setInterval(tick, 10);
  };

  // Pause timer function
  const pauseTimer = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Resume timer function
  const resumeTimer = () => {
    setIsPaused(false);
    intervalRef.current = window.setInterval(tick, 10);
  };

  // Fast forward timer function
  const fastForwardTimer = () => {
    setTotalMilliseconds(0);
    setIsCompleted(true);
    currentRoundRef.current = rounds;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
  };

  // Check if input is valid
  const inputValid = () => {
    return (
      (inputWorkMinutes > 0 || inputWorkSeconds > 0) &&
      (inputRestMinutes > 0 || inputRestSeconds > 0) &&
      rounds > 0
    );
  };

  // Notify parent of changes
  useEffect(() => {
    if (isWorkoutTimer && onChange) {
      onChange({
        workTime: { minutes: inputWorkMinutes, seconds: inputWorkSeconds },
        restTime: { minutes: inputRestMinutes, seconds: inputRestSeconds },
        rounds,
        isValid: inputValid(),
      });
    }
  }, [
    inputWorkMinutes,
    inputWorkSeconds,
    inputRestMinutes,
    inputRestSeconds,
    rounds,
    isWorkoutTimer,
    onChange,
  ]);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Panel
      title="Tabata"
      description="An interval timer with work/rest periods. Example: 20s/10s, 8 rounds, would count down from 20 seconds to 0, then count down from 10 seconds to 0, then from 20, then from 10, etc, for 8 rounds. A full round includes both the work and rest. In this case, 20+10=30 seconds per round."
    >
      {/* Timer Display */}
      {!isWorkoutTimer && (
      <div className="w-full flex justify-center">
        <DisplayTime 
          minutes={getMinutes(totalMilliseconds)} 
          seconds={getSeconds(totalMilliseconds)} 
          hundredths={getHundredths(totalMilliseconds)} 
        />
      </div>
        )}

      {!isWorkoutTimer && (
        <div className="mt-2 flex items-baseline gap-x-2 justify-center mb-8">
            <DisplayMode mode={timerMode} />
            <p className="text-lg font-semibold tracking-tight text-white ">Round </p>
            <DisplayRounds rounds={rounds} currentRound={currentRoundRef.current} />
        </div>
    )}

      <hr className="border-slate-700" />

      {/* Timer Inputs */}
      <div className="w-full flex justify-center">
        <TabataInputs
          workMinutes={inputWorkMinutes}
          workSeconds={inputWorkSeconds}
          restMinutes={inputRestMinutes}
          restSeconds={inputRestSeconds}
          rounds={rounds}
          onWorkMinutesChange={setInputWorkMinutes}
          onWorkSecondsChange={setInputWorkSeconds}
          onRestMinutesChange={setInputRestMinutes}
          onRestSecondsChange={setInputRestSeconds}
          onRoundsChange={setRounds}
          disabled={isRunning || isPaused || isCompleted}
        />
      </div>

      {/* Timer Buttons */}
      {!isWorkoutTimer && (
        <div className="flex flex-col w-full space-y-4 mt-5 min-h-48">
          {!isCompleted && (
            <>
              {isRunning ? (
                isPaused ? (
                  <Button type="resume" onClick={resumeTimer} />
                ) : (
                  <Button type="pause" onClick={pauseTimer} />
                )
              ) : (
                inputValid() && <Button type="start" onClick={startTimer} />
              )}
            </>
          )}

          {(isRunning || isPaused || isCompleted) && <Button type="reset" onClick={resetTimer} />}

          {isRunning && !isCompleted && <Button type="fastforward" onClick={fastForwardTimer} />}
        </div>
      )}
    </Panel>
  );
};

export default Tabata;