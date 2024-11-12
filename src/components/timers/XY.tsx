import Button from '../generic/Button';
import DisplayTime from '../generic/DisplayTime';
import Input from '../generic/Input';
import Panel from '../generic/Panel';
import DisplayRounds from '../generic/DisplayRounds';

import { useState, useEffect, useRef } from 'react';

const XY = () => {
    const [inputMinutes, setInputMinutes] = useState(0);
    const [inputSeconds, setInputSeconds] = useState(0);
    const [rounds, setRounds] = useState(1);
    const [totalMilliseconds, setTotalMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const currentRoundRef = useRef<number>(1);
    const intervalRef = useRef<number | null>(null);

    const targetMilliseconds = (inputMinutes * 60000) + (inputSeconds * 1000);

    // Time functions
    const getMinutes = () => Math.floor(totalMilliseconds / 60000);
    const getSeconds = () => Math.floor((totalMilliseconds % 60000) / 1000);
    const getHundredths = () => Math.floor((totalMilliseconds % 1000) / 10);

    // Reset timer function
    const resetTimer = ()  => {
        setIsRunning(false);
        setIsPaused(false);
        setIsCompleted(false);
        currentRoundRef.current = 1;
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
            if (currentRoundRef.current < rounds) {
                // Move to the next round
                setTimeout(() => {
                    currentRoundRef.current += 1;
                    setTotalMilliseconds(targetMilliseconds); // Reset timer for the next round
                }, 100); // Delay to smooth the UI update
            } else {
                // If all rounds are complete, stop the timer
                fastForwardTimer();
            }
        }
    }, [totalMilliseconds, isRunning, rounds, targetMilliseconds]);

    // Start timer function
    const startTimer = () => {
        currentRoundRef.current = 1;
        setTotalMilliseconds(targetMilliseconds);
        setIsRunning(true);
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

    // Input change for minutes, seconds, and rounds
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

    const handleRoundsChange = (rounds: number) => {
        setRounds(rounds);
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
            title="XY"
            description="A timer that counts down from X time per round, for Y number of rounds (e.g. 1 minute for 10 minutes would count down from 1 minute to 0, then start another countdown, etc, 10 times"
        >
            <div className="w-full flex justify-center">
                <DisplayTime
                    minutes={getMinutes()}
                    seconds={getSeconds()}
                    hundredths={getHundredths()}
                />
            </div>

            <DisplayRounds rounds={rounds} currentRound={currentRoundRef.current} />

            <hr className="border-slate-700" />

            <div className="w-full flex justify-center">
                <Input 
                    minutes={inputMinutes}
                    seconds={inputSeconds}
                    rounds={rounds}
                    onMinutesChange={handleMinutesChange}
                    onSecondsChange={handleSecondsChange}
                    onRoundsChange={handleRoundsChange}
                    disabled={isRunning || isPaused || isCompleted}
                />
            </div>


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

export default XY;
