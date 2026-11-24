import type { CSSProperties, ReactNode } from "react";
import "./BookLayout.css";

interface BookLayoutProps {
  left: ReactNode; // hoja izquierda
  children: ReactNode; // hoja derecha
  ribbon?: ReactNode; // marcapáginas (número del capítulo)
  /** En pantallas angostas, la hoja izquierda pasa al final y se pega abajo */
  leftLast?: boolean;
  leftWidth?: string; // ancho de la hoja izquierda en escritorio
}

// Libro de tela abierto sobre el escritorio: dos hojas en pantallas anchas,
// una sola hoja en pantallas angostas.
const BookLayout = ({ left, children, ribbon, leftLast, leftWidth }: BookLayoutProps) => {
  return (
    <main className="desk">
      <div className="book">
        <div className="book-cover">
          <div
            className={`book-pages ${leftLast ? "book-pages-left-last" : ""}`}
            style={leftWidth ? ({ "--left-col": leftWidth } as CSSProperties) : undefined}
          >
            <section className="book-page book-page-left">{left}</section>
            <section className="book-page book-page-right">
              {ribbon && <div className="ribbon">{ribbon}</div>}
              {children}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookLayout;
