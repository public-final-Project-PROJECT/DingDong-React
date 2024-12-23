// 오른쪽 상단 타이머 고정

/**
 * pm 05:20
 *  - 고정 타이머 컴포넌트 분리 [구현]
 *  - 분리 후 고정 타이머 SmallTimer.js 를 Timer.js 로 임포트 [구현]
 *  - 각각의 모든 페이지에 고정 타이머 유지 [구현]
 * 
 * 12월 23일 pm 04:57
 *  [문제]: Layout 에 SmallTimer 삽입 시 고정 타이머 나타나지 않음 [해결]
 * 
 * 12월 24일 am 09:47
 *  [문제]: Layout 에 SmallTimer 삽입 시 고정 타이머가 유지되긴하나 숫자가 나오지 않음 [해결]
 *          -> Layout 에 그냥 때려넣어서 안됐던 건에 대하여.
 * pm 02:55
 *  [문제]: 모든 페이지에 잘 나오는데 페이지 이동 시 메인 타이머가 보이지 않을 때와 같이 타이머가 멈춤
 *          편의기능 > 타이머에 다시 들어가면 감소된 시간만큼 줄어있음 [해결 中] (이상해,,)
 * 
 * */


import React, { useContext } from "react";
import "../asset/css/SmallTimer.css"; // 별도의 스타일 시트
import { TimerContext } from './TimerContext';

const SmallTimer = () => {

    const { time, isComplete } = useContext(TimerContext);

    // console.log("SmallTimer Props Time : ", time);
    // console.log("SmallTimer Props isComplete : ", isComplete);


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

