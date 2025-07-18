import React, { createContext, useContext } from "react";

const LoggerContext = createContext();

export const LoggerProvider = ({ children }) => {
  const logEvent = (level, message, meta) => {
    console[level](`[${level.toUpperCase()}] ${message}`, meta || {});
  };

  return (
    <LoggerContext.Provider value={{ logEvent }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error("useLogger must be used within a LoggerProvider");
  }
  return context;
};
