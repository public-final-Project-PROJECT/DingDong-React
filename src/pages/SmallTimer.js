import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TimerContext } from "./TimerContext";
import "../asset/css/SmallTimer.css";

const SmallTimer = () => {
    const { time, isRunning } = useContext(TimerContext); // 메인 타이머 상태 가져오기
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    const [position, setPosition] = useState(() => {
        const savedPosition = JSON.parse(localStorage.getItem("smallTimerPosition"));
        return savedPosition || { x: 100, y: 100 }; // 기본 위치
    });

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [localTime, setLocalTime] = useState(time); // 로컬 타이머 시간 관리

    useEffect(() => {
        if (position) {
            localStorage.setItem("smallTimerPosition", JSON.stringify(position));
        }
    }, [position]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    const handleTimerClick = () => {
        if (!isDragging) {
            navigate("/Timer");
        }
    };

    // 타이머 시간이 감소되도록 로컬 상태 업데이트
    useEffect(() => {
        setLocalTime(time); // `TimerContext`에서 시간 동기화

        let timer;
        if (isRunning && time > 0) {
            timer = setInterval(() => {
                setLocalTime((prev) => Math.max(prev - 1, 0)); // 시간이 0이 되지 않도록 방지
            }, 1000);
        }

        return () => clearInterval(timer); // 컴포넌트 언마운트 시 클리어
    }, [time, isRunning]);

    if (!isRunning) return null; // 메인 타이머가 실행 중일 때만 렌더링

    return (
        <div
            className="small-timer"
            onMouseDown={handleMouseDown}
            onDoubleClick={handleTimerClick}
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: "move",
                userSelect: "none",
            }}
        >
            <div className="timer-display">
                {localTime != null
                    ? `${String(Math.floor(localTime / 60)).padStart(2, "0")}:${String(
                        localTime % 60
                    ).padStart(2, "0")}`
                    : "00:00"}
            </div>
        </div>
    );
};

export default SmallTimer;
