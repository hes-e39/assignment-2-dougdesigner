import Button from '../generic/Button';
import DisplayTime from '../generic/DisplayTime';
import Inputs from '../generic/Inputs';
import Panel from '../generic/Panel';

import { useEffect, useRef, useState } from 'react';
import { getMinutes, getSeconds, getHundredths } from '../../utils/helpers';

const Stopwatch = () => {
    const [inputMinutes, setInputMinutes] = useState(0);
    const [inputSeconds, setInputSeconds] = useState(0);
    const [totalMilliseconds, setTotalMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const targetMilliseconds = inputMinutes * 60000 + inputSeconds * 1000;

    // Stopwatch function
    const tick = () => {
        setTotalMilliseconds(prevMilliseconds => {
            if (prevMilliseconds < targetMilliseconds) {
                return prevMilliseconds + 10;
            } else {
                fastForwardTimer();
                return prevMilliseconds;
            }
        });
    };

    // Start timer function
    const startTimer = () => {
        setTotalMilliseconds(0);
        setIsRunning(true);
        intervalRef.current = setInterval(tick, 10);
    };

    // Pause timer function
    const pauseTimer = () => {
        setIsPaused(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Resume timer function
    const resumeTimer = () => {
        setIsPaused(false);
        intervalRef.current = setInterval(tick, 10);
    };

    // Fast forward timer function
    const fastForwardTimer = () => {
        setTotalMilliseconds(targetMilliseconds);
        setIsCompleted(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(false);
    };

    // Reset timer function
    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(false);
        setTotalMilliseconds(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Input change functions
    const handleMinutesChange = (minutes: number) => {
        setInputMinutes(minutes);
    };

    const handleSecondsChange = (seconds: number) => {
        setInputSeconds(seconds);
    };

    // Check if input is valid
    const inputValid = () => {
        return inputMinutes > 0 || inputSeconds > 0;
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <Panel title="Stopwatch" description="A timer that counts up to X amount of time (e.g. count up to 2 minutes and 30 seconds, starting at 0) ">
            {/* Timer Display */}
            <div className="w-full flex justify-center">
                <DisplayTime 
                    minutes={getMinutes(totalMilliseconds)} 
                    seconds={getSeconds(totalMilliseconds)} 
                    hundredths={getHundredths(totalMilliseconds)} 
                />
            </div>

            <hr className="border-slate-700" />

            {/* Timer Inputs */}
            <div className="w-full flex justify-center">
                <Inputs minutes={inputMinutes} seconds={inputSeconds} onMinutesChange={handleMinutesChange} onSecondsChange={handleSecondsChange} disabled={isRunning || isPaused || isCompleted} />
            </div>

            {/* Timer Buttons */}
            <div className="flex flex-col w-full space-y-4 mt-5">
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
        </Panel>
    );
};

export default Stopwatch;
