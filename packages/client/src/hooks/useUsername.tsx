import { createContext, type ReactNode, useContext, useState } from "react";

interface UsernameContextValue {
  username: string;
  setUsername: (value: string) => void;
}

const UsernameContext = createContext<UsernameContextValue | null>(null);

function getStoredUsername(): string {
  try {
    const v = localStorage.getItem("username");
    return v ? JSON.parse(v) : "";
  } catch {
    return "";
  }
}

export function UsernameProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string>(getStoredUsername);

  function setUsername(value: string) {
    localStorage.setItem("username", JSON.stringify(value));
    setUsernameState(value);
  }

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  const ctx = useContext(UsernameContext);
  if (!ctx) throw new Error("useUsername must be used within UsernameProvider");
  return ctx;
}
