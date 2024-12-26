import React, { useState, useEffect, useContext } from "react";
import "../asset/css/Timer.css";
import SmallTimer from "./SmallTimer";
import { TimerContext } from "./TimerContext";

const Timer = () => {
    const radius = 100;
    const circumference = 2 * Math.PI * radius;

    const { time, setTime, isComplete, setIsComplete, isRunning, setIsRunning } = useContext(TimerContext); // isRunning 추가
    const [inputTime, setInputTime] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const calculateStrokeDashoffset = () =>
        circumference - ((time || 0) / ((inputTime || 1) * 60)) * circumference;

    const [strokeDashoffset, setStrokeDashoffset] = useState(calculateStrokeDashoffset());

    useEffect(() => {
        // ...타이머 복원 로직 유지
    }, []);

    useEffect(() => {
        setStrokeDashoffset(calculateStrokeDashoffset());
    }, [time, inputTime]);

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
            localStorage.removeItem("timerRunning");
        }

        return () => clearInterval(timer);
    }, [isRunning, time]);

    const handleSetTime = (e) => {
        const newTime = e.target.value * 60;
        setInputTime(e.target.value);
        setTime(newTime);
        setIsRunning(false);
        setIsComplete(false);
        localStorage.setItem("timerTime", newTime);
        localStorage.removeItem("lastUpdated");
    };

    const handleStart = () => {
        setIsRunning(true);
        setIsComplete(false);
    };

    const handlePause = () => setIsRunning(false);

    const handleReset = () => {
        setTime(0);
        setInputTime(null);
        setIsRunning(false);
        setIsComplete(false);
        localStorage.setItem("timerTime", "0");
        localStorage.removeItem("lastUpdated");
    };

    return (
        <div className="center-container">
            <SmallTimer time={time} isComplete={isComplete} />
                <>
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
                                    transition: isInitialized
                                        ? "stroke-dashoffset 1s linear"
                                        : "none",
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
                                {`${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}`}
                            </text>
                        </svg>
                    </div>
                    <div className="input-container">
                        <input
                            type="number"
                            value={inputTime || ""}
                            onChange={handleSetTime}
                            min="1"
                            className="timerTime-input"
                        />
                        <span className="min-text">분</span>
                        <button
                            onClick={handleStart}
                            disabled={isRunning || time === 0}
                            className="start-button"
                        >
                            시작
                        </button>
                        {isRunning && (
                            <button onClick={handlePause} className="pause-button">
                                멈춤
                            </button>
                        )}
                    </div>
                </>
        </div>
    );
};

export default Timer;
