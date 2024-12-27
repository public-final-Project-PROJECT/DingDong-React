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
 *  - 고정 타이머 커서로 이동 시 움직이도록 [미구현]
 *  - 고정 타이머 다른 페이지에 있을 때 클릭 시 메인 타이머 페이지로 이동 [미구현]
 * */


// import React, { useContext } from "react";
// import "../asset/css/SmallTimer.css";
// import { TimerContext } from "./TimerContext";

// const SmallTimer = () => {
//     const { time, isComplete, isRunning } = useContext(TimerContext);

//     const formatTime = (time) => {
//         const minutes = String(Math.floor(time / 60)).padStart(2, "0");
//         const seconds = String(time % 60).padStart(2, "0");
//         return `${minutes}:${seconds}`;
//     };

//     if (!isRunning) return null; // isRunning이 false면 렌더링하지 않음

//     return (
//         <div className={`small-timer ${isComplete ? "complete" : ""}`}>
//             <span>{formatTime(time)}</span>
//         </div>
//     );
// };

// export default SmallTimer;

import React, { useState } from "react";
import "../asset/css/SmallTimer.css";

const SmallTimer = ({ time, isComplete }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 }); // 드래그로 변경되는 위치

    const handleDragStart = (e) => {
        const rect = e.target.getBoundingClientRect();
        e.dataTransfer.setData("text/plain", JSON.stringify({
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
        }));
    };

    const handleDrag = (e) => {
        if (e.clientX === 0 && e.clientY === 0) return; // 드래그 종료 시 무시
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const offset = JSON.parse(e.dataTransfer.getData("text/plain"));
        setPosition({
            x: e.clientX - offset.offsetX,
            y: e.clientY - offset.offsetY,
        });
    };

    const handleDragOver = (e) => e.preventDefault();

    return (
        <div
            className="small-timer"
            draggable="true"
            onDragStart={handleDragStart}
            onDrag={handleDrag}
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
