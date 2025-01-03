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

    const calculateStrokeDashoffset = (timeValue = time, inputTimeValue = inputTime) => {
        const validInputTime = inputTimeValue || 1; // 기본값: 1분
        return circumference - (timeValue / (validInputTime * 60)) * circumference;
    };


    // 원형 타이머 갱신
    useEffect(() => {
        setStrokeDashoffset(calculateStrokeDashoffset());
    }, [time, inputTime]);

    useEffect(() => {
        const savedTime = localStorage.getItem("timerTime");
        const savedInputTime = localStorage.getItem("timerInputTime");
        const lastUpdated = localStorage.getItem("lastUpdated");
        const savedRunning = localStorage.getItem("timerRunning");
        const savedComplete = localStorage.getItem("timerComplete");

        console.log("복원 로직 시작");
        console.log({ savedTime, savedInputTime, lastUpdated, savedRunning, savedComplete });

        // 복원된 inputTime 값 검증
        const restoredInputTime = parseInt(savedInputTime, 10);
        if (isNaN(restoredInputTime) || restoredInputTime <= 0) {
            console.warn("복원된 inputTime이 유효하지 않음:", savedInputTime);
            setInputTime(1); // 기본값 설정 (예: 1분)
        } else {
            setInputTime(restoredInputTime);
        }

        if (savedTime && lastUpdated) {
            const elapsed = Math.floor((Date.now() - Number(lastUpdated)) / 1000);
            const remainingTime = Math.max(0, parseInt(savedTime, 10) - elapsed);

            console.log("복원된 시간:", remainingTime);

            setTime(remainingTime);
            setIsRunning(savedRunning === "true");
            setIsComplete(savedComplete === "true");

            if (remainingTime === 0) {
                setIsComplete(true);
                setIsRunning(false);
            } else {
                setIsComplete(false);
            }

            // strokeDashoffset 값 복원
            setStrokeDashoffset(calculateStrokeDashoffset(remainingTime, restoredInputTime));
        } else {
            console.log("타이머 상태 초기화");
            setTime(0);
            setIsRunning(false);
            setIsComplete(false);
            setStrokeDashoffset(circumference);
        }

        setTimeout(() => setIsInitialized(true), 100);
    }, []);




    useEffect(() => {
        let timer;
        console.log("타이머 실행 상태:", { isRunning, time });

        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime - 1;
                    console.log("타이머 감소:", newTime);
                    localStorage.setItem("timerTime", newTime);
                    localStorage.setItem("lastUpdated", Date.now().toString());
                    return newTime;
                });
            }, 1000);
        } else if (time === 0) {
            console.log("타이머 완료");
            setIsComplete(true);
            setIsRunning(false);
            localStorage.setItem("timerRunning", "false");
        }

        return () => clearInterval(timer);
    }, [isRunning, time]);


    // 시간 설정
    const handleSetTime = (e) => {
        const newInputTime = parseInt(e.target.value, 10); // 입력 값을 숫자로 변환
        if (!isNaN(newInputTime) && newInputTime > 0) {
            setInputTime(newInputTime);
            localStorage.setItem("timerInputTime", newInputTime.toString());
        } else {
            console.error("유효하지 않은 입력값:", e.target.value);
        }
    };

    useEffect(() => {
        console.log("타이머 상태:", { isRunning, time, inputTime, strokeDashoffset });
    }, [isRunning, time, inputTime, strokeDashoffset]);


    // 타이머 시작
    const handleStart = () => {
        // 새로 시작할 때 inputTime이 0이 아니면 시작
        if (time === 0 && inputTime > 0) {
            const newTime = inputTime * 60; // 분을 초로 변환
            setTime(newTime);
            setStrokeDashoffset(circumference);
            localStorage.setItem("timerTime", newTime);
        } else if (time > 0 && !isRunning) {
            // 타이머가 이미 진행 중이라면 다시 시작
            setIsRunning(true);
            localStorage.setItem("timerRunning", "true");
            localStorage.setItem("lastUpdated", Date.now().toString());
        }

        setIsComplete(false);
        localStorage.setItem("timerRunning", "true");
    };




    // 타이머 멈춤
    const handlePause = () => {
        console.log("멈춤 버튼 클릭");
        setIsRunning(false);
        localStorage.setItem("timerRunning", "false");
    };

    // 타이머 초기화
    const handleReset = () => {
        console.log("초기화 버튼 클릭");
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

    // 타이머 완료 후 다시 시작
    const handleRestart = () => {
        setTime(inputTime * 60);  // 시간을 다시 시작할 시간으로 설정
        setIsRunning(false);
        setIsComplete(false);
        setStrokeDashoffset(circumference);  // 원형 타이머 초기화
        localStorage.setItem("timerTime", inputTime * 60);
        localStorage.setItem("timerRunning", "false");
        localStorage.setItem("lastUpdated", Date.now().toString());
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
                <div className="input-container">
                    {isComplete ? (
                        <button onClick={handleRestart} className="restart-button">
                            다시시작
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
                                시작
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Timer;
