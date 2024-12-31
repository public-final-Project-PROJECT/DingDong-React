import React, { useState, useEffect, useContext } from "react";
import "../asset/css/Timer.css";
import { TimerContext } from "./TimerContext";

const Timer = () => {
    const radius = 100;
    const circumference = 2 * Math.PI * radius;

    const { time, setTime, isComplete, setIsComplete, isRunning, setIsRunning } = useContext(TimerContext);
    const [inputTime, setInputTime] = useState(null); // 초기 값 null로 설정
    const [isInitialized, setIsInitialized] = useState(false);
    const [isReset, setIsReset] = useState(false); // 초기화 상태 관리

    // strokeDashoffset 계산 함수
    const calculateStrokeDashoffset = () => {
        if (!inputTime || time === 0) return circumference;
        return circumference - (time / (inputTime * 60)) * circumference;
    };

    // strokeDashoffset 상태
    const [strokeDashoffset, setStrokeDashoffset] = useState(calculateStrokeDashoffset());

    useEffect(() => {
        const savedTime = localStorage.getItem("timerTime");
        const lastUpdated = localStorage.getItem("lastUpdated");
        const savedRunning = localStorage.getItem("timerRunning");
        const savedInputTime = localStorage.getItem("timerInputTime");

        if (savedInputTime) {
            setInputTime(parseInt(savedInputTime, 10));
        }

        if (savedTime && lastUpdated && savedRunning !== null) {
            const elapsed = Math.floor((Date.now() - Number(lastUpdated)) / 1000);
            const remainingTime = Math.max(0, parseInt(savedTime, 10) - elapsed);

            setTime(remainingTime);
            setIsRunning(savedRunning === "true");

            if (remainingTime === 0) {
                setIsComplete(true);
                setIsRunning(false);
            } else {
                setIsComplete(false);
            }

            const restoredStrokeDashoffset = circumference -
                (remainingTime / (parseInt(savedInputTime, 10) * 60)) * circumference;

            setStrokeDashoffset(restoredStrokeDashoffset);
            setTimeout(() => setIsInitialized(true), 100);
        } else {
            setIsRunning(false);
            setIsComplete(false);
            setStrokeDashoffset(circumference);
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
        if (inputTime) {
            setStrokeDashoffset(calculateStrokeDashoffset());
        }
    }, [time, inputTime]);

    useEffect(() => {
        localStorage.setItem("timerRunning", isRunning.toString());
    }, [isRunning]);

    useEffect(() => {
        const savedInputTime = localStorage.getItem("timerInputTime");
        if (savedInputTime) {
            setInputTime(parseInt(savedInputTime, 10));
        }
    }, []);

    const handleSetTime = (e) => {
        const newTime = e.target.value * 60;
        setInputTime(e.target.value);
        setTime(newTime);
        setIsRunning(false);
        setIsComplete(false);

        localStorage.setItem("timerTime", newTime);
        localStorage.setItem("timerInputTime", e.target.value);
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
        setStrokeDashoffset(circumference);
        setIsReset(true);

        localStorage.setItem("timerTime", "0");
        localStorage.removeItem("lastUpdated");
        localStorage.setItem("timerRunning", "false");
    };

    const handleRestart = () => {
        setIsReset(false);
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
                {isReset ? (
                    <div className="complete-container">
                        <button onClick={handleRestart} className="restart-button">
                            다시시작
                        </button>
                    </div>
                ) : (
                    <div className="input-container">
                        {isRunning ? (
                            <>
                                <button onClick={handlePause} className="pause-button">멈춤</button>
                                <button onClick={handleReset} className="reset-button">초기화</button>
                            </>
                        ) : (
                            <>
                                {time > 0 ? (
                                    <>
                                        <button onClick={handleStart} className="start-button">계속</button>
                                        <button onClick={handleReset} className="reset-button">초기화</button>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="number"
                                            value={inputTime || ""} // 초기값이 없으면 빈 문자열로 설정
                                            onChange={handleSetTime}
                                            min="1"
                                            className="timerTime-input"
                                        />
                                        <span className="min-text">분</span>
                                        <button onClick={handleStart} disabled={!inputTime} className="start-button">시작</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timer;
