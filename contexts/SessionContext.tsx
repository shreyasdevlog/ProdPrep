"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type InterviewType = "Product Design" | "RCA" | "Strategy";
export type Domain = "Fintech" | "Google" | "Cred" | "Meta" | "Amazon" | "Other";

export interface SessionData {
  interviewType: InterviewType | null;
  domain: Domain | null;
  cvText: string;
  cvFileName: string;
  interviewId: string | null;
}

interface SessionContextType {
  sessionData: SessionData;
  updateSessionData: (data: Partial<SessionData>) => void;
  resetSession: () => void;
}

const defaultSessionData: SessionData = {
  interviewType: null,
  domain: null,
  cvText: "",
  cvFileName: "",
  interviewId: null,
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionData, setSessionData] = useState<SessionData>(defaultSessionData);

  const updateSessionData = (data: Partial<SessionData>) => {
    setSessionData((prev) => ({ ...prev, ...data }));
  };

  const resetSession = () => {
    setSessionData(defaultSessionData);
  };

  return (
    <SessionContext.Provider value={{ sessionData, updateSessionData, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
