import React, { useState, useEffect, useContext } from "react";
import "../asset/css/Timer.css";
import { TimerContext } from "./TimerContext";

const Timer = () => {
    const radius = 100;
    const circumference = 2 * Math.PI * radius;

    const { time, setTime, isRunning, setIsRunning } = useContext(TimerContext);
    const [inputTime, setInputTime] = useState(null);
    const [strokeDashoffset, setStrokeDashoffset] = useState(circumference);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const calculateStrokeDashoffset = () => {
        if (!inputTime || time === 0) return circumference;
        return circumference - (time / (inputTime * 60)) * circumference;
    };

    useEffect(() => {
        const savedTime = localStorage.getItem("timerTime");
        const savedInputTime = localStorage.getItem("timerInputTime");
        const lastUpdated = localStorage.getItem("lastUpdated");
        const savedRunning = localStorage.getItem("timerRunning");

        if (savedInputTime) setInputTime(parseInt(savedInputTime, 10));

        if (savedTime && lastUpdated) {
            const elapsed = Math.floor((Date.now() - Number(lastUpdated)) / 1000);
            const remainingTime = Math.max(0, parseInt(savedTime, 10) - elapsed);

            setTime(remainingTime);
            setIsRunning(savedRunning === "true");

            if (remainingTime === 0) {
                setIsComplete(true);
                setIsRunning(false);
            }

            setStrokeDashoffset(
                circumference -
                (remainingTime / (parseInt(savedInputTime, 10) * 60)) * circumference
            );
        } else {
            setTime(0);
        }

        setTimeout(() => setIsInitialized(true), 100);
    }, []);

    useEffect(() => {
        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime - 1;
                    localStorage.setItem("timerTime", newTime);
                    localStorage.setItem("lastUpdated", Date.now().toString());
                    return newTime;
                });
            }, 1000);
        } else if (time === 0) {
            setIsComplete(true);
            setIsRunning(false);
        }

        return () => clearInterval(timer);
    }, [isRunning, time]);

    useEffect(() => {
        setStrokeDashoffset(calculateStrokeDashoffset());
    }, [time, inputTime]);

    const handleSetTime = (e) => {
        const newTime = e.target.value * 60;
        setInputTime(e.target.value);
        setTime(newTime);
        setIsRunning(false);
        setIsComplete(false);
        localStorage.setItem("timerTime", newTime);
        localStorage.setItem("timerInputTime", e.target.value);
    };

    const handleStart = () => {
        if (inputTime) {
            setIsRunning(true);
            setIsComplete(false);
            localStorage.setItem("timerRunning", "true");
        }
    };

    const handlePause = () => {
        setIsRunning(false);
        localStorage.setItem("timerRunning", "false");
    };

    const handleReset = () => {
        setTime(0);
        setInputTime(null);
        setIsRunning(false);
        setIsComplete(false);
        setStrokeDashoffset(circumference);
        localStorage.removeItem("timerTime");
        localStorage.removeItem("timerInputTime");
        localStorage.removeItem("timerRunning");
    };

    const handleRestart = () => {
        setTime(inputTime * 60);
        setStrokeDashoffset(circumference);
        setIsRunning(false);
        setIsComplete(false);
        localStorage.setItem("timerTime", inputTime * 60);
    };

    return (
        <div className="center-container">
            <div>
                <h1 className="timer-text">타이머</h1>
                <div className="circle-timer">
                    <svg width="250" height="250" viewBox="0 0 250 250">
                        <circle
                            cx="125"
                            cy="125"
                            r={radius}
                            stroke="lightgray"
                            strokeWidth="10"
                            fill="none"
                        />
                        <circle
                            cx="125"
                            cy="125"
                            r={radius}
                            stroke="green"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 125 125)"
                            style={{
                                transition: isInitialized ? "stroke-dashoffset 1s linear" : "none",
                            }}
                        />
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="32"
                            fontWeight="bold"
                            fill="black"
                        >
                            {`${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
                                time % 60
                            ).padStart(2, "0")}`}
                        </text>
                    </svg>
                </div>
                {isComplete ? (
                    <button onClick={handleRestart} className="restart-button">
                        다시시작
                    </button>
                ) : (
                    <div className="input-container">
                        {!isRunning && time === 0 && (
                            <>
                                <input
                                    type="number"
                                    value={inputTime || ""}
                                    onChange={handleSetTime}
                                    min="1"
                                    className="timerTime-input"
                                />
                                <span className="min-text">분</span>
                                <button onClick={handleStart} className="start-button">
                                    시작
                                </button>
                            </>
                        )}
                        {isRunning && (
                            <>
                                <button onClick={handlePause} className="pause-button">
                                    멈춤
                                </button>
                                <button onClick={handleReset} className="reset-button">
                                    초기화
                                </button>
                            </>
                        )}
                        {!isRunning && time > 0 && (
                            <>
                                <button onClick={handleStart} className="start-button">
                                    계속
                                </button>
                                <button onClick={handleReset} className="reset-button">
                                    초기화
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timer;
