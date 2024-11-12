import Panel from '../generic/Panel';
import Button from '../generic/Button';
import DisplayTime from '../generic/DisplayTime';
import TabataInput from '../generic/TabataInput';
import DisplayRounds from '../generic/DisplayRounds';
import DisplayRest from '../generic/DisplayRest';

import { useState, useEffect, useRef } from 'react';

const Tabata = () => {
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

    const workMilliseconds = (inputWorkMinutes * 60000) + (inputWorkSeconds * 1000);
    const restMilliseconds = (inputRestMinutes * 60000) + (inputRestSeconds * 1000);

    const targetMilliseconds = timerMode === 'work' ? workMilliseconds : restMilliseconds;

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

    // Input change functions
    const handWorkMinutesChange = (minutes: number) => {
        setInputWorkMinutes(minutes)
        setTotalMilliseconds((minutes * 60000) + (inputWorkSeconds * 1000));
    };

    const handleWorkSecondsChange = (seconds: number) => {
        setInputWorkSeconds(seconds);
        setTotalMilliseconds((inputWorkMinutes * 60000) + (seconds * 1000));
    };

    const handleRestMinutesChange = (minutes: number) => {
        setInputRestMinutes(minutes);
        setTotalMilliseconds((minutes * 60000) + (inputRestSeconds * 1000));
    };

    const handleRestSecondsChange = (seconds: number) => {
        setInputRestSeconds(seconds);
        setTotalMilliseconds((inputRestMinutes * 60000) + (seconds * 1000));
    };

    const handleRoundsChange = (rounds: number) => {
        setRounds(rounds);
    };

    // Check if input is valid
    const inputValid = () => {
        return (inputWorkMinutes > 0 || inputWorkSeconds > 0);
    };

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

            <div className="w-full flex justify-center">
                <DisplayTime
                    minutes={getMinutes()}
                    seconds={getSeconds()}
                    hundredths={getHundredths()}
                />
            </div>

            <div className="flex justify-center">
                <DisplayRest mode={timerMode} />
                <DisplayRounds rounds={rounds} currentRound={currentRoundRef.current} />  
            </div>

            <hr className="border-slate-700" />
               
            <div className="w-full flex justify-center">
                <TabataInput
                    workMinutes={inputWorkMinutes}
                    workSeconds={inputWorkSeconds}
                    restMinutes={inputRestMinutes}
                    restSeconds={inputRestSeconds}
                    rounds={rounds}
                    onWorkMinutesChange={handWorkMinutesChange}
                    onWorkSecondsChange={handleWorkSecondsChange}
                    onRestMinutesChange={handleRestMinutesChange}
                    onRestSecondsChange={handleRestSecondsChange}
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

export default Tabata;
