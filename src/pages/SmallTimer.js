import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TimerContext } from "./TimerContext";
import "../asset/css/SmallTimer.css";

const SmallTimer = () => {
    const { time } = useContext(TimerContext); // TimerContext에서 time 가져오기
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    // 타이머의 위치 상태 (로컬스토리지에서 초기값 복원)
    const [position, setPosition] = useState(() => {
        const savedPosition = JSON.parse(localStorage.getItem("smallTimerPosition"));
        return savedPosition || { x: 100, y: 100 }; // 기본 위치
    });

    // 드래그 상태 관리
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // 위치를 로컬스토리지에 저장
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
    }, [isDragging, offset]);

    // 타이머 클릭 시 메인 타이머 페이지로 이동
    const handleTimerClick = () => {
        if (!isDragging) {
            navigate("/Timer");
        }
    };

    return (
        <div
            className="small-timer"
            onMouseDown={handleMouseDown}
            onClick={handleTimerClick}
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: "move",
                userSelect: "none",
            }}
        >
            <div className="timer-display">
                {time != null
                    ? `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
                        time % 60
                    ).padStart(2, "0")}`
                    : "00:00"}
            </div>
        </div>
    );
};

export default SmallTimer;
