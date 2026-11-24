import type { LoroExpression } from "@/types";

interface CompanionProps {
  expression?: LoroExpression;
  size?: number; // ancho en píxeles
}

const COLOR = {
  body: "#8ca89b",
  bodyDark: "#6f8c7f",
  belly: "#dbe4dd",
  cheek: "#efe9dd",
  wing: "#6f8fa0",
  wingDark: "#556f7e",
  beak: "#d2b27a",
  beakDark: "#b8965c",
  mouth: "#5a4a3a",
  ink: "#2e3438",
  eyeWhite: "#faf8f4",
  perch: "#a59b8c",
  thought: "#c9cfd3",
};

const LABEL: Record<LoroExpression, string> = {
  happy: "contento",
  thinking: "pensando",
  surprised: "sorprendido",
  explaining: "explicando",
  wink: "guiñando un ojo",
};

// Cuánto abre el pico en cada expresión
const MOUTH_OPEN: Record<LoroExpression, number> = {
  happy: 3,
  thinking: 0,
  surprised: 11,
  explaining: 6,
  wink: 2,
};

const BROW: Record<LoroExpression, string> = {
  happy: "M76 33 Q86 28 96 32",
  thinking: "M76 35 Q86 31 96 27",
  surprised: "M76 27 Q86 21 96 25",
  explaining: "M76 34 Q86 30 96 34",
  wink: "M76 33 Q86 28 96 32",
};

// Señor Loro: guardián del libro y compañero de aventura. Dibujo simple en SVG.
const Companion = ({ expression = "happy", size = 140 }: CompanionProps) => {
  const open = MOUTH_OPEN[expression];
  const surprised = expression === "surprised";
  const eyeRadius = surprised ? 11 : 9;
  const pupilRadius = surprised ? 3.5 : 4.5;
  const look =
    expression === "thinking" ? { x: 2.5, y: -3 } : { x: 0.5, y: 0.5 };

  return (
    <svg
      viewBox="0 0 170 180"
      width={size}
      height={(size * 180) / 170}
      role="img"
      aria-label={`Señor Loro, ${LABEL[expression]}`}
    >
      {/* percha */}
      <rect x="22" y="160" width="126" height="8" rx="4" fill={COLOR.perch} />

      {/* cola */}
      <polygon points="76,112 56,170 76,164 88,172 100,114" fill={COLOR.wing} />

      {/* patas */}
      <path
        d="M70 148 V161 M90 148 V161"
        stroke={COLOR.beakDark}
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* cuerpo y pecho */}
      <ellipse cx="80" cy="105" rx="40" ry="52" fill={COLOR.body} />
      <ellipse cx="86" cy="116" rx="26" ry="38" fill={COLOR.belly} />

      {/* ala (cambia según la expresión) */}
      {expression === "explaining" ? (
        <path
          d="M100 98 C122 88 140 92 154 72 C156 100 136 120 106 122 Z"
          fill={COLOR.wing}
          stroke={COLOR.wingDark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : expression === "thinking" ? (
        <path
          d="M90 108 C112 104 116 88 108 74 C94 80 86 94 88 108 Z"
          fill={COLOR.wing}
          stroke={COLOR.wingDark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M52 88 C38 110 44 142 66 150 C80 130 80 100 66 84 Z"
          fill={COLOR.wing}
          stroke={COLOR.wingDark}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}

      {/* cabeza */}
      <circle cx="80" cy="52" r="34" fill={COLOR.body} />
      <ellipse cx="88" cy="57" rx="22" ry="19" fill={COLOR.cheek} />

      {/* plumas de la cabeza (más levantadas si está sorprendido) */}
      <path
        d={
          surprised
            ? "M70 22 Q68 8 78 16 M78 16 Q82 2 90 14 M90 14 Q98 6 98 20"
            : "M74 20 Q78 11 86 18"
        }
        stroke={COLOR.bodyDark}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* interior de la boca: queda justo debajo del pico de arriba */}
      <path
        d={`M98 58 C106 58 112 64 116 72 L114 ${71 + open} L99 ${60 + open} Z`}
        fill={COLOR.mouth}
      />

      {/* pico: la parte de abajo baja cuando abre */}
      <path
        d="M99 60 C108 60 114 64 114 71 C108 72 102 68 99 60 Z"
        fill={COLOR.beakDark}
        transform={`translate(0 ${open})`}
      />
      <path
        d="M98 40 C122 36 132 58 116 72 C112 64 106 58 98 58 Z"
        fill={COLOR.beak}
        stroke={COLOR.beakDark}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ojo */}
      {expression === "wink" ? (
        <path
          d="M77 47 Q86 53 95 47"
          stroke={COLOR.ink}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <>
          <circle
            cx="86"
            cy="46"
            r={eyeRadius}
            fill={COLOR.eyeWhite}
            stroke={COLOR.bodyDark}
            strokeWidth="1.5"
          />
          <circle
            cx={87 + look.x}
            cy={46 + look.y}
            r={pupilRadius}
            fill={COLOR.ink}
          />
          <circle cx={85 + look.x} cy={44 + look.y} r="1.4" fill="#fff" />
        </>
      )}

      {/* ceja */}
      <path
        d={BROW[expression]}
        stroke={COLOR.wingDark}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* pensando: puntitos de pensamiento */}
      {expression === "thinking" && (
        <>
          <circle cx="126" cy="30" r="3" fill={COLOR.thought} />
          <circle cx="137" cy="19" r="4" fill={COLOR.thought} />
          <circle cx="151" cy="9" r="5.5" fill={COLOR.thought} />
        </>
      )}
    </svg>
  );
};

export default Companion;
