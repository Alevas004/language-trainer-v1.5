import { useCallback, useState } from "react";
import Boss from "@/app/boss/Boss";
import Lexicon from "@/app/lexicon/Lexicon";
import Morphosyntax from "@/app/morphosyntax/Morphosyntax";
import Phonology from "@/app/phonology/Phonology";
import Pragmatics from "@/app/pragmatics/Pragmatics";
import Teacher from "@/app/teacher/Teacher";
import Wand from "@/components/common/Wand";
import BossGuard from "@/middleware/BossGuard";
import type { Screen } from "@/types";

// Controla qué pantalla se muestra (sin enrutador, funciona igual offline)
const App = () => {
  const [screen, setScreen] = useState<Screen>("teacher");
  const goHome = useCallback(() => setScreen("teacher"), []);
  const nav = { onExit: goHome, onHome: goHome };

  let content;
  switch (screen) {
    case "teacher":
      content = <Teacher onNavigate={setScreen} />;
      break;
    case "phonology":
      content = <Phonology {...nav} />;
      break;
    case "morphosyntax":
      content = <Morphosyntax {...nav} />;
      break;
    case "lexicon":
      content = <Lexicon {...nav} />;
      break;
    case "pragmatics":
      content = <Pragmatics {...nav} />;
      break;
    case "boss":
      // El boss pasa por la guarda; los cuatro juegos están siempre abiertos
      content = (
        <BossGuard onBlocked={goHome}>
          <Boss {...nav} />
        </BossGuard>
      );
      break;
  }

  return (
    <>
      <Wand />
      {content}
    </>
  );
};

export default App;
