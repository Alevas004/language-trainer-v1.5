import { useEffect, type ReactNode } from "react";
import { useProgress } from "@/hook/useProgress";

interface BossGuardProps {
  children: ReactNode;
  onBlocked: () => void; // qué hacer si el boss sigue bloqueado
}

// Solo deja pasar al boss si se completaron los 4 juegos o el docente lo abrió
const BossGuard = ({ children, onBlocked }: BossGuardProps) => {
  const { bossUnlocked } = useProgress();

  useEffect(() => {
    if (!bossUnlocked) onBlocked();
  }, [bossUnlocked, onBlocked]);

  return bossUnlocked ? <>{children}</> : null;
};

export default BossGuard;
