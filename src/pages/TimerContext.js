import React, { createContext, useState } from "react";

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [time, setTime] = useState(2400);
    const [isComplete, setIsComplete] = useState(false);

    return (
        <TimerContext.Provider value={{ time, setTime, isComplete, setIsComplete }}>
            {children}
        </TimerContext.Provider>
    );
};
