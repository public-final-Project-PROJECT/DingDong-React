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
 *  - 초등학교 수업 시간인 40분에 맞춰 초기갑을 2400초(40분) 로 설정 [구현]
 *  - 타이머가 0으로 줄어들도록 [구현]
 *  - 시간이 종료 시 타이머의 배경색과 숫자 색이 빨간색으로 변경되도록 [구현]
 *  - 시작 버트을 누르면 타이머 동작 실행 [구현]
 *  - 타이머가 동작 중이거나 시간이 0이면 버튼 비활성화 [구현]
 *  - 남은 시간과 타이머 상태를 저장하여 다른 페이지로 이동하거나 새로고침 시에도 상태 유지 [구현]
 *
 *  am 06:06
 *  - 원하는 시간을 입력하여 타이머가 설정되도록 [구현]
 *  - 새로운 시간으로 입력 후 재설정 시 타이머가 정지되고 입력한 시간부터 재시작 [구현]
 *  - 시간 종료 시 타이머가 빨간색으로 변한 후 확인 버튼이 나타남 [구현]
 *  - 확인 버튼 클릭 시 타이머 초기화된 후 설정화면으로 돌아감 [구현]
 *
 *  am 06:33
 *  - 타이머 크기 증가
 **/

// 지피티한테 코드 정리해달라고 하니까 깔끔하게 바꿔줌

import React, { useState, useEffect } from "react";

const Timer = () => {
    const [time, setTime] = useState(2400); // 타이머 시간 (초 단위)
    const [isRunning, setIsRunning] = useState(false); // 타이머 상태 (시작/중지)
    const [inputTime, setInputTime] = useState(40); // 입력 시간 (분 단위)
    const [isComplete, setIsComplete] = useState(false); // 시간이 완료되었는지 여부

    // 컴포넌트가 마운트될 때 Local Storage에서 이전 상태를 복원
    useEffect(() => {
        const storedTime = localStorage.getItem("countdown-time");
        const storedRunning = localStorage.getItem("countdown-running");

        if (storedTime) setTime(parseInt(storedTime, 10));
        if (storedRunning === "true") setIsRunning(true);
    }, []);

    // 타이머가 작동 중이면 초 단위로 감소
    useEffect(() => {
        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime - 1;
                    localStorage.setItem("countdown-time", newTime); // 남은 시간을 Local Storage에 저장
                    return newTime;
                });
            }, 1000);
        } else if (time === 0) {
            setIsComplete(true); // 시간이 끝났을 때 완료 상태로 전환
            setIsRunning(false); // 타이머 중지
        }

        // 타이머 정리
        return () => clearInterval(timer);
    }, [isRunning, time]);

    // 타이머 상태가 변경될 때 Local Storage에 저장
    useEffect(() => {
        localStorage.setItem("countdown-running", isRunning);
    }, [isRunning]);

    // 시작 버튼 핸들러
    const handleStart = () => {
        setIsRunning(true);
    };

    // 시간 설정 핸들러
    const handleSetTime = () => {
        const newTime = inputTime * 60; // 분을 초로 변환
        setTime(newTime);
        localStorage.setItem("countdown-time", newTime);
        setIsRunning(false); // 시간 변경 시 타이머 정지
        setIsComplete(false); // 완료 상태 초기화
    };

    // 초기화 핸들러 (확인 버튼 클릭 시)
    const handleReset = () => {
        setInputTime(40); // 기본 시간(40분)
        setTime(2400); // 초기화 (초 단위)
        setIsComplete(false); // 완료 상태 초기화
    };

    // 시간 포맷팅 (항상 두 자리로 표시)
    const formatTime = (time) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <>
            {/* 오른쪽 상단 타이머 표시 */}
            <div
                style={{
                    ...styles.smallTimer,
                    backgroundColor: time === 0 ? "red" : "#000",
                }}
            >
                <span>{formatTime(time)}</span>
            </div>

            {/* 타이머 제어 UI */}
            <div style={styles.centerContainer}>
                {isComplete ? (
                    <>
                        <h1 style={{ color: "red" }}>타이머 완료!</h1>
                        <button onClick={handleReset}>확인</button>
                    </>
                ) : (
                    <>
                        <h1>Countdown Timer</h1>
                        <h2
                            style={{
                                color: time === 0 ? "red" : "#000",
                            }}
                        >
                            {formatTime(time)}
                        </h2>
                        {/* 시간 설정 UI */}
                        <div style={styles.inputContainer}>
                            <input
                                type="number"
                                value={inputTime}
                                onChange={(e) => setInputTime(e.target.value)}
                                min="1"
                                style={styles.input}
                            />
                            <span>분</span>
                            <button onClick={handleSetTime} style={{ marginLeft: "10px" }}>
                                Set Time
                            </button>
                        </div>
                        <button onClick={handleStart} disabled={isRunning || time === 0}>
                            Start
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

// CSS 스타일
const styles = {
    smallTimer: {
        position: "fixed",
        top: "10px",
        right: "10px",
        color: "#fff",
        padding: "15px 30px", // 크기 증가
        borderRadius: "10px",
        fontSize: "36px", // 크기 증가
        fontFamily: "Arial, sans-serif",
        zIndex: 1000,
    },
    centerContainer: {
        textAlign: "center",
        marginTop: "50px",
    },
    inputContainer: {
        marginBottom: "20px",
    },
    input: {
        width: "50px",
        textAlign: "center",
    },
};


export default Timer;