import Button from '../generic/Button';
import DisplayTime from '../generic/DisplayTime';
import Input from '../generic/Input';
import Panel from '../generic/Panel';

import { useState, useEffect, useRef } from 'react';

const Countdown = () => {
    const [inputMinutes, setInputMinutes] = useState(0);
    const [inputSeconds, setInputSeconds] = useState(0);
    const [totalMilliseconds, setTotalMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const targetMilliseconds = (inputMinutes * 60000) + (inputSeconds * 1000);

    // Time functions
    const getMinutes = () => Math.floor(totalMilliseconds / 60000);
    const getSeconds = () => Math.floor((totalMilliseconds % 60000) / 1000);
    const getHundredths = () => Math.floor((totalMilliseconds % 1000) / 10);

    // Display time functions
    const getDisplayMinutes = () => {
        if (totalMilliseconds === 0 && !isRunning) {
            return 0;
        }
        if (isRunning || totalMilliseconds > 0) {
            return getMinutes();
        }
        return inputMinutes;
    };

    const getDisplaySeconds = () => {
        if (totalMilliseconds === 0 && !isRunning) {
            return 0;
        }
        if (isRunning || totalMilliseconds > 0) {
            return getSeconds();
        }
        return inputSeconds;
    };

    const getDisplayHundredths = () => {
        if (isRunning) {
            return getHundredths();
        }
        return 0;
    };

    // Reset timer function
    const resetTimer = () => {
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(false);
        setTotalMilliseconds(targetMilliseconds);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Countdown function
    const tick = () => {
        setTotalMilliseconds((prevMilliseconds) => {
            if (prevMilliseconds > 0) {
                return prevMilliseconds - 10;
            } else {
                fastForwardTimer();
                return 0;
            }
        });
    };

    // Start timer function
    const startTimer = () => {
        setTotalMilliseconds(targetMilliseconds);
        setIsRunning(true);
        intervalRef.current = window.setInterval(tick, 10);
    };

    // Pause timer function
    const pauseTimer = () => {
        setIsPaused(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Resume timer funciton
    const resumeTimer = () => {
        setIsPaused(false);
        intervalRef.current = window.setInterval(tick, 10);
    };

    // Fast forward timer function
    const fastForwardTimer = () => {
        setTotalMilliseconds(0);
        setIsCompleted(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setIsPaused(false);
    };

    // Input change for minutes and seconds functions
    const handleMinutesChange = (minutes: number) => {
        setInputMinutes(minutes);
        if (!isRunning) {
            setTotalMilliseconds((minutes * 60000) + (inputSeconds * 1000));
        }

    };

    const handleSecondsChange = (seconds: number) => {
        setInputSeconds(seconds);
        if (!isRunning) {
            setTotalMilliseconds((inputMinutes * 60000) + (seconds * 1000));
        }
    };

    // Check if input is valid
    const inputValid = () => {
        return (inputMinutes > 0 || inputSeconds > 0);
    };

    // Clear interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <Panel 
            title="Countdown" 
            description="A timer that counts down from X amount of time (e.g. count down to 0, starting at 2 minutes and 30)"
            >

            <div className="w-full flex justify-center">
                <DisplayTime 
                    minutes={getDisplayMinutes()}
                    seconds={getDisplaySeconds()}
                    hundredths={getDisplayHundredths()} />
            </div>

            <hr className="border-slate-700" />

            <div className="w-full flex justify-center">
                <Input 
                    minutes={inputMinutes} 
                    seconds={inputSeconds} 
                    onMinutesChange={handleMinutesChange} 
                    onSecondsChange={handleSecondsChange}
                    disabled={isRunning || isPaused || isCompleted} 
                />
            </div>
           
            <div className="flex flex-col w-full space-y-4 mt-5">
                {!isCompleted && (
                    <>
                        {isRunning ? (
                            <Button type={isPaused ? "resume" : "pause"} onClick={isPaused ? resumeTimer : pauseTimer} />
                        ) : (
                            inputValid() && <Button type="start" onClick={startTimer} />
                        )}
                    </>
                )}

                {(isRunning || isPaused || isCompleted) && (
                    <Button type="reset" onClick={resetTimer} />
                )}
                {isRunning && !isCompleted && (
                    <Button type="fastforward" onClick={fastForwardTimer} />
                )}
            </div>
        </Panel>
    );
};

export default Countdown;
