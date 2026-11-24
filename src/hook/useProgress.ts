import { useContext } from "react";
import { ProgressContext } from "@/context/ProgressContext";

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress debe usarse dentro de ProgressProvider");
  }
  return context;
};
