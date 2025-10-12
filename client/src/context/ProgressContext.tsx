import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

interface ProgressData {
  versesRead: number;
  timeSpent: number; // seconds
}

interface ProgressContextValue extends ProgressData {
  startTracking: () => void;
  stopTracking: () => void;
  incrementVerses: (count: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined,
);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem("readingProgress");
    return saved ? JSON.parse(saved) : { versesRead: 0, timeSpent: 0 };
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem("readingProgress", JSON.stringify(progress));
  }, [progress]);

  const startTracking = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setProgress((p) => ({ ...p, timeSpent: p.timeSpent + 1 }));
    }, 1000);
  };

  const stopTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const incrementVerses = (count: number) => {
    setProgress((p) => ({ ...p, versesRead: p.versesRead + count }));
  };

  return (
    <ProgressContext.Provider
      value={{ ...progress, startTracking, stopTracking, incrementVerses }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return ctx;
};
