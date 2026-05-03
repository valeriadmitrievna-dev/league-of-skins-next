"use client";
import { createContext, useContext, useState, PropsWithChildren, FC } from "react";

interface AppContext {
  skinsCount: number;
  chromasCount: number;
  setSkinsCount: (count: number) => void;
  setChromasCount: (count: number) => void;
}

const AppContext = createContext<AppContext | null>(null);

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [skinsCount, setSkinsCount] = useState(0);
  const [chromasCount, setChromasCount] = useState(0);

  return (
    <AppContext.Provider value={{ skinsCount, chromasCount, setSkinsCount, setChromasCount }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};