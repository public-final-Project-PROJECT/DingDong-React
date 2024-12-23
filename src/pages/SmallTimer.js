// 오른쪽 상단 타이머 고정

/**
 * pm 05:20
 *  - 고정 타이머 컴포넌트 분리 [구현]
 *  - 분리 후 고정 타이머 SmallTimer.js 를 Timer.js 로 임포트 [구현]
 *  - 각각의 모든 페이지에 고정 타이머 유지 [미구현]
 * 
 * 12월 23일 pm 04:57
 *  [문제]: Layout 에 SmallTimer 삽입 시 고정 타이머 나타나지 않음 [미해결]
 * 
 * */


import React from "react";
import "../asset/css/SmallTimer.css"; // 별도의 스타일 시트

const SmallTimer = ({ time, isComplete }) => {
    const formatTime = (time) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, "0");
        const seconds = String(time % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div className={`small-timer ${isComplete ? "complete" : ""}`}>
            <span>{formatTime(time)}</span>
        </div>
    );
};

export default SmallTimer;

// import React from "react";
// import "../asset/css/SmallTimer.css";

// const SmallTimer = ({ time, isComplete }) => {
//     const formatTime = (time) => {
//         const minutes = String(Math.floor(time / 60)).padStart(2, "0");
//         const seconds = String(time % 60).padStart(2, "0");
//         return `${minutes}:${seconds}`;
//     };

//     return (
//         <div className={`small-timer ${isComplete ? "complete" : ""}`}>
//             <span>{formatTime(time)}</span>
//         </div>
//     );
// };

// export default SmallTimer;

