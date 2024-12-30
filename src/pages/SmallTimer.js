// 오른쪽 상단 타이머 고정

/**
 * pm 05:20
 *  - 고정 타이머 컴포넌트 분리 [구현]
 *  - 분리 후 고정 타이머 SmallTimer.js 를 Timer.js 로 임포트 [구현]
 *  - 각각의 모든 페이지에 고정 타이머 유지 [구현]
 *
 * 12월 23일 pm 04:57
 *  - [문제]: Layout 에 SmallTimer 삽입 시 고정 타이머 나타나지 않음 [해결]
 *
 * 12월 24일 am 09:47
 *  - [문제]: Layout 에 SmallTimer 삽입 시 고정 타이머가 유지되긴하나 숫자가 나오지 않음 [해결]
 *          -> Layout 에 그냥 때려넣어서 안됐던 건에 대하여.
 *
 * pm 02:55
 *  - [문제]: 모든 페이지에 잘 나오는데 페이지 이동 시 메인 타이머가 보이지 않을 때와 같이 타이머가 멈춤
 *          편의기능 > 타이머에 다시 들어가면 감소된 시간만큼 줄어있음 [해결中] (이상해,,)
 *
 * 12월 27일 am 01:57
 *  - 메인 타이머 실행 시에만 고정 타이머 나타나면서 작동 [구현]
 *  - 고정 타이머 커서로 이동 시 움직이도록 [구현]
 *  - 고정 타이머 다른 페이지에 있을 때 클릭 시 메인 타이머 페이지로 이동 [미구현]
 * 
 * 12/30 pm 12:50
 *  - 문제: 고정 타이머 움직이게 했는데 다시 안 움직이는 건에 대하여
 * */

import React, { useState, useEffect } from "react";
import "../asset/css/SmallTimer.css";

const SmallTimer = ({ time, isRunning }) => {
    const [position, setPosition] = useState({ x: 10, y: 10 }); // 초기 위치 설정

    // 위치 복원
    useEffect(() => {
        const savedPosition = localStorage.getItem("smallTimerPosition");
        if (savedPosition) {
            setPosition(JSON.parse(savedPosition));
        }
    }, []);

    const handleDragStart = (e) => {
        const rect = e.target.getBoundingClientRect();
        e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top,
            })
        );

        // 빈 이미지 설정
        const img = new Image();
        img.src = "";
        e.dataTransfer.setDragImage(img, 0, 0);

        e.target.style.opacity = "0.5"; // 드래그 중 투명도 조정
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = "1"; // 드래그 종료 후 복원
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const offset = JSON.parse(e.dataTransfer.getData("text/plain"));
        const newPosition = {
            x: e.clientX - offset.offsetX,
            y: e.clientY - offset.offsetY,
        };
        setPosition(newPosition);
        localStorage.setItem("smallTimerPosition", JSON.stringify(newPosition)); // 위치 저장
    };

    const handleDragOver = (e) => e.preventDefault();

    // 실행 중일 때만 렌더링
    if (!isRunning) return null;

    return (
        <div
            className="small-timer"
            draggable="true"
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
            }}
        >
            <div className="timer-display">
                {`${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
                    time % 60
                ).padStart(2, "0")}`}
            </div>
        </div>
    );
};

export default SmallTimer;
