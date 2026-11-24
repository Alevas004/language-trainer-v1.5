import "./Picture.css";

interface PictureProps {
  emoji: string;
  size?: "sm" | "md" | "lg";
  repeat?: number;
}

// Imagen de un ítem. Se dibuja con un emoji suavizado (colores apagados) dentro
// de un círculo neutro. Más adelante se puede cambiar por un SVG propio.
const Picture = ({ emoji, size = "md", repeat = 1 }: PictureProps) => {
  return (
    <span className={`picture picture-${size}`} aria-hidden="true">
      {Array.from({ length: repeat }, (_, i) => (
        <span key={i}>{emoji}</span>
      ))}
    </span>
  );
};

export default Picture;
