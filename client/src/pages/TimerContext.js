import React, { createContext, useState } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [time, setTime] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isRunning, setIsRunning] = useState(false); // 추가된 상태

    return (
        <TimerContext.Provider
            value={{ time, setTime, isComplete, setIsComplete, isRunning, setIsRunning }}
        >
            {children}
        </TimerContext.Provider>
    );
};
