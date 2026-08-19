"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type Accent =
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black";

type AccentContextValue = {
  accent: Accent;
  setAccent: (accent: Accent) => void;
};

const AccentContext = createContext<AccentContextValue | undefined>(
  undefined,
);

const DEFAULT_ACCENT: Accent = "amber";

function getAccent(): Accent {
  if (typeof window === "undefined") {
    return DEFAULT_ACCENT;
  }

  const savedAccent = localStorage.getItem("accent");

  if (
    savedAccent === "amber" ||
    savedAccent === "blue" ||
    savedAccent === "pink" ||
    savedAccent === "rose" ||
    savedAccent === "emerald" ||
    savedAccent === "black"
  ) {
    return savedAccent;
  }

  return DEFAULT_ACCENT;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

export function AccentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const accent = useSyncExternalStore(
    subscribe,
    getAccent,
    () => DEFAULT_ACCENT,
  );

  function setAccent(value: Accent) {
    localStorage.setItem("accent", value);
    document.documentElement.dataset.accent = value;
    window.dispatchEvent(new Event("storage"));
  }

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  return (
    <AccentContext.Provider value={{ accent, setAccent }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const context = useContext(AccentContext);

  if (!context) {
    throw new Error("useAccent must be used inside AccentProvider");
  }

  return context;
}
