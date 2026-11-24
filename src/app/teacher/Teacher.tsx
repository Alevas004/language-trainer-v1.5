import Companion from "@/components/common/Companion";
import Button from "@/components/ui/Button";
import Ornament from "@/components/ui/Ornament";
import { BOSS_CHAPTER, COMPONENTS } from "@/data/structure";
import { useModal } from "@/hook/useModal";
import { useProgress } from "@/hook/useProgress";
import BookLayout from "@/layouts/BookLayout";
import type { Screen } from "@/types";
import PortalCard from "./components/PortalCard";
import SettingsPanel from "./components/SettingsPanel";
import "./Teacher.css";

interface TeacherProps {
  onNavigate: (screen: Screen) => void;
}

// Interfaz del docente: la portada del libro y su índice de capítulos
const Teacher = ({ onNavigate }: TeacherProps) => {
  const { completedCount, bossUnlocked, progress } = useProgress();
  const { isOpen, openModal, closeModal } = useModal();

  const cover = (
    <div className="cover fade-in">
      <div> 

      </div>
      <div> 
        <span className="sparkle sparkle-a" aria-hidden="true" />
        <span className="sparkle sparkle-b" aria-hidden="true" />
        <span className="sparkle sparkle-c" aria-hidden="true" />
        <div className="cover-loro">
          <Companion expression="wink" size={170} />
        </div>
        <div className="cover-title">
          <h1>Language Trainer</h1>
          <Ornament />
          <p className="cover-sub">El libro de las palabras</p>
          {progress.profileName ? progress.profileName && <p className="cover-profile">{progress.profileName}</p> : <p className="cover-profile">Perfil no definido</p>}
        </div>
        <div className="cover-actions">
          <Button variant="quiet" onClick={openModal}>
            Panel del docente
          </Button>
        </div>
      </div>
     
      <div className="cover-footer">
        <p>Copyright 2026 Language Trainer. Todos los derechos reservados.</p>
        <p>Desarrollado por Cesar Alejandro Vasquez Restrepo</p>
      </div>
    </div>
  );

  return (
    <BookLayout left={cover} leftWidth="minmax(280px, 0.8fr)">
      <nav className="index fade-in" aria-label="Índice del libro">
        <header className="index-head">
          <h2>Índice</h2>
          <p>Elige un capítulo</p>
        </header>

        {COMPONENTS.map((component) => (
          <section className="index-group" key={component.id}>
            <h3>{component.name}</h3>
            {component.subcomponents.map((sub) => (
              <PortalCard
                key={sub.id}
                chapterId={sub.id}
                numeral={sub.numeral}
                chapter={sub.chapter}
                name={sub.name}
                completedLevels={completedCount(sub.id)}
                onClick={() => onNavigate(sub.id)}
              />
            ))}
          </section>
        ))}

        <section className="index-group index-last">
          <h3>Última página</h3>
          <PortalCard
            chapterId="boss"
            chapter={BOSS_CHAPTER}
            name="Reúne todo lo aprendido"
            locked={!bossUnlocked}
            lockedText="Se abre al completar los cuatro capítulos"
            onClick={() => onNavigate("boss")}
          />
        </section>
      </nav>
      <SettingsPanel open={isOpen} onClose={closeModal} />
    </BookLayout>
  );
};

export default Teacher;
