import React, { useState, useEffect, useContext } from "react";
import "../asset/css/Timer.css";
import SmallTimer from "./SmallTimer"; // SmallTimer 불러오기
import { TimerContext } from './TimerContext';

const Timer = () => {
    const radius = 100; // 원의 반지름
    const circumference = 2 * Math.PI * radius; // 원의 둘레

    const { time, setTime, isComplete, setIsComplete } = useContext(TimerContext);
    const [isRunning, setIsRunning] = useState(false);
    const [inputTime, setInputTime] = useState(40); // 초기 입력 시간 (40분)

    const calculateRemainingTime = () => {
        const savedTime = localStorage.getItem("timerTime");
        const lastUpdated = localStorage.getItem("lastUpdated");

        if (savedTime && lastUpdated) {
            const elapsed = Math.floor((Date.now() - Number(lastUpdated)) / 1000);
            return Math.max(0, parseInt(savedTime, 10) - elapsed);
        }
        return 0;
    };

    useEffect(() => {
        const savedTime = localStorage.getItem("timerTime");
        const lastUpdated = localStorage.getItem("lastUpdated");
        const savedRunning = localStorage.getItem("timerRunning");
    
        if (savedTime && lastUpdated) {
            const elapsed = Math.floor((Date.now() - Number(lastUpdated)) / 1000);
            const remainingTime = Math.max(0, parseInt(savedTime, 10) - elapsed);
    
            setTime(remainingTime);
            setIsRunning(savedRunning === "true");
    
            if (remainingTime === 0) {
                setIsComplete(true);
            }
        }
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
            localStorage.removeItem("timerRunning");
        }

        return () => clearInterval(timer);
    }, [isRunning, time]);

    useEffect(() => {
        localStorage.setItem("timerRunning", isRunning.toString());
    }, [isRunning]);

    useEffect(() => {
        localStorage.setItem("inputTime", (inputTime * 60).toString());
    }, [inputTime]);

    const handleStart = () => {
        setIsRunning(true);
        setIsComplete(false);
    };

    const handleReset = () => {
        const newTime = inputTime * 60;
        setTime(newTime);
        setIsRunning(false);
        setIsComplete(false);
        localStorage.setItem("timerTime", newTime);
        localStorage.setItem("lastUpdated", Date.now().toString());
    };

    const strokeDashoffset = circumference - (time / (inputTime * 60)) * circumference;

    return (
        <div className="center-container">
            <SmallTimer time={time} isComplete={isComplete} />

            {isComplete ? (
                <>
                    <h1 style={{ color: "red" }}>타이머 완료</h1>
                    <button onClick={handleReset}>리셋</button>
                </>
            ) : (
                <>
                <h1>타이머</h1>
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
                            stroke="blue"
                            strokeWidth="10"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 125 125)"
                    style={{transition: isRunning ? "stroke-dashoffset 1s linear" : "none"}}
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
                            value={inputTime}
                            onChange={(e) => setInputTime(e.target.value)}
                            min="1"
                            className="input"
                        />
                        <span>분</span>
                    </div>
                    <button onClick={handleStart} disabled={isRunning || time === 0}>
                        시작
                    </button>
                </>
            )}
        </div>
    );
};

export default Timer;
