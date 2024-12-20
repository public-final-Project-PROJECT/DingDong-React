// 편의기능 > 타이머 페이지


/**
 * Timer
 * 12월 20일 am 12:01
 *  - 타이머 상태와 시간을 저장함 [구현]
 *  - 페이지 새로고침이나 이동 시에도 상태 유지 [구현]
 *  - 분, 초는 두자리 수로 유지 [구현]
 *
 *  am 01:48
 *  - 화면 오른쪽 상단에 타이머 고정 (항상 작동) [구현]
 *  - 타이머가 항상 화면 위에 표시 되도록 스타일 적용 [구현]
 *
 *  am 04:54
 *  - 초등학교 수업 시간인 40분에 맞춰 초기값을 2400초(40분) 로 설정 [구현]
 *  - 타이머가 0으로 줄어들도록 [구현]
 *  - 시간이 종료 시 타이머의 배경색과 숫자 색이 빨간색으로 변경되도록 [구현]
 *  - 시작 버튼을 누르면 타이머 작동 실행 [구현]
 *  - 타이머가 작동 중이거나 시간이 0이면 버튼 비활성화 [구현]
 *  - 남은 시간과 타이머 상태를 저장하여 다른 페이지로 이동하거나 새로고침 시에도 상태 유지 [미구현]
 *
 *  am 06:06
 *  - 원하는 시간을 입력하여 타이머가 설정되도록 [구현]
 *  - 새로운 시간으로 입력 후 재설정 시 타이머가 정지되고 입력한 시간부터 재시작 [구현]
 *  - 시간 종료 시 타이머가 빨간색으로 변한 후 확인 버튼이 나타남 [구현]
 *  - 확인 버튼 클릭 시 타이머 초기화된 후 설정화면으로 돌아감 [구현]
 *
 *  am 06:33
 *  - 타이머 크기 증가
 * 
 * 
 * am 10:07
 *  - 리액트 페이지 헤더 라인에 타이머 같이 배치 [미구현]
 * 
 * pm 03:44
 * [변수 발생]
 *  - 편의기능 안에서의 이동, 새로고침은 가능하나 헤더의 다른 페이지 클릭 시 고정 타이머가 사라짐
 *  - 타이머 페이지에서 계속 작동함
 *  (동작: 사람이나 생명체의 움직임 , 작동: 기계류의 움직임)
 **/



import React, { useState, useEffect } from "react";
import '../asset/css/Timer.css';

const Timer = () => {
    const [time, setTime] = useState(2400);
    const [isRunning, setIsRunning] = useState(false);
    const [inputTime, setInputTime] = useState(40);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const storedTime = localStorage.getItem("countdown-time");
        const storedRunning = localStorage.getItem("countdown-running");

        if (storedTime) setTime(parseInt(storedTime, 10));
        if (storedRunning === "true") setIsRunning(true);
    }, []);

    useEffect(() => {
        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime - 1;
                    localStorage.setItem("countdown-time", newTime);
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
        localStorage.setItem("countdown-running", isRunning);
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
    };

    // const handleSetTime = () => {
    //     const newTime = inputTime * 60;
    //     setTime(newTime);
    //     localStorage.setItem("countdown-time", newTime);
    //     setIsRunning(false);
    //     setIsComplete(false);
    // };

    const handleReset = () => {
        setInputTime(1);
        setTime(60);
        setIsComplete(false);
    };

    const formatTime = (time) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <>
            <div
                className={`small-timer ${time === 0 ? "complete" : ""}`}
            >
                <span>{formatTime(time)}</span>
            </div>

            <div className="center-container">
                {isComplete ? (
                    <>
                        <h1 style={{ color: "red" }}>타이머 시작</h1>
                        <button onClick={handleReset}>확인</button>
                    </>
                ) : (
                    <>
                        <h1>Timer</h1>
                        <h2 style={{ color: time === 0 ? "red" : "#000" }}>
                            {formatTime(time)}
                        </h2>
                        <div className="input-container">
                            <input
                                type="number"
                                value={inputTime}
                                onChange={(e) => setInputTime(e.target.value)}
                                min="1"
                                className="input"
                            />
                            <span>분</span>
                            {/* <button onClick={handleSetTime} style={{ marginLeft: "10px" }}>
                                준비
                            </button> */}
                        </div>
                        <button onClick={handleStart} disabled={isRunning || time === 0}>
                            시작
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default Timer;