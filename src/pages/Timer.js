// 새로 고침 제외 다른 기능 완벽 구현

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
        if (inputTime) {
            const newStrokeDashoffset = calculateStrokeDashoffset();
            setStrokeDashoffset(newStrokeDashoffset);
        }
    }, [time, inputTime]);


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
            setIsRunning(savedRunning === "true"); // 실행 상태 복원

            if (remainingTime === 0) {
                setIsComplete(true);
                setIsRunning(false);
            }

            const restoredStrokeDashoffset =
                circumference - (remainingTime / (parseInt(savedInputTime, 10) * 60)) * circumference;
            setStrokeDashoffset(restoredStrokeDashoffset); // 복원된 `strokeDashoffset` 설정
        } else {
            setStrokeDashoffset(circumference); // 초기 상태로 설정
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


    const handleStart = () => {
        if (!isRunning && time === 0 && inputTime) {
            const newTime = inputTime * 60; // 입력된 시간을 초로 변환
            setTime(newTime); // 타이머 시간 설정
            setStrokeDashoffset(circumference); // 원형 타이머 초기화
            localStorage.setItem("timerTime", newTime);
        }

        setIsRunning(true); // 실행 상태 설정
        setIsComplete(false);
        localStorage.setItem("timerRunning", "true");
        localStorage.setItem("lastUpdated", Date.now().toString()); // 타이머 시작 시간 저장
    };

    const handlePause = () => {
        setIsRunning(false);
        localStorage.setItem("timerRunning", "false");
    };

    const handleSetTime = (e) => {
        const newInputTime = e.target.value; // 입력 값 가져오기
        setInputTime(newInputTime); // 상태에 반영
        setIsRunning(false); // 타이머 실행 중지
        setIsComplete(false); // 완료 상태 초기화
        localStorage.setItem("timerInputTime", newInputTime); // 로컬 스토리지에 저장
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
        localStorage.removeItem("lastUpdated");
    };


    const handleRestart = () => {
        // 타이머 입력 초기화
        setTime(0); // 타이머 값을 초기화
        setInputTime(null); // 입력 값 초기화
        setIsRunning(false); // 타이머가 실행되지 않도록 설정
        setIsComplete(false); // 완료 상태 초기화
        setStrokeDashoffset(circumference); // 원형 타이머 초기화
        localStorage.removeItem("timerTime"); // 저장된 타이머 값 제거
        localStorage.removeItem("timerInputTime"); // 저장된 입력 값 제거
        localStorage.removeItem("timerRunning"); // 실행 상태 제거
    };


    return (
        <div className="center-container">
            <div>
                <h1 className="timer-text">타이머</h1>
                <div className="circle-timer">
                    <svg width="500" height="500" viewBox="0 0 250 250">
                        <circle
                            cx="125"
                            cy="125"
                            r={radius}
                            stroke="lightgray"
                            strokeWidth="15"
                            fill="none"
                        />
                        <circle
                            cx="125"
                            cy="125"
                            r={radius}
                            stroke="green"
                            strokeWidth="15"
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
                <div className="input-container">
                    {isComplete ? (
                        <button onClick={handleRestart} className="restart-button">
                            시작
                        </button>
                    ) : isRunning ? (
                        <>
                            <button onClick={handlePause} className="pause-button">
                                멈춤
                            </button>
                            <button onClick={handleReset} className="reset-button">
                                초기화
                            </button>
                        </>
                    ) : time > 0 ? (
                        <>
                            <button onClick={handleStart} className="start-button">
                                계속
                            </button>
                            <button onClick={handleReset} className="reset-button">
                                초기화
                            </button>
                        </>
                    ) : (
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
                                실행
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

};

export default Timer;