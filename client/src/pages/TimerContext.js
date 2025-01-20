import React, { createContext, useState } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false); // 실행 여부 관리
    const [isComplete, setIsComplete] = useState(false);

    return (
        <TimerContext.Provider
            value={{
                time,
                setTime,
                isRunning,
                setIsRunning,
                isComplete,
                setIsComplete,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};
