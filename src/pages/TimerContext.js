import React, { createContext, useContext, useState } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [time, setTime] = useState(0);  // 메인 타이머의 시간
    const [isComplete, setIsComplete] = useState(false);
    const [isRunning, setIsRunning] = useState(false); // 메인 타이머 실행 상태

    return (
        <TimerContext.Provider
            value={{ time, setTime, isComplete, setIsComplete, isRunning, setIsRunning }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);