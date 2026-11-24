# Language Trainer

Videojuego web para estimular los componentes del lenguaje en niños de 7 a 9 años (tercero de primaria).

## Comandos

```bash
npm install
npm run dev      # desarrollo
npm run build    # compilación para Netlify
```

## Reglas del juego

- Los cuatro juegos están siempre abiertos y se pueden jugar en cualquier orden.
- Dentro de cada juego, las 5 páginas (niveles) se abren de una en una (`LEVELS_ARE_SEQUENTIAL` en `src/data/structure.ts`).
- El boss (La Gran Página) se abre al completar los cuatro juegos o desde el Panel del docente.
- Sin errores visibles, sin vidas y sin cronómetro por defecto.

## Estructura de los juegos

- `src/data/<juego>/`: bancos de contenido (palabras, oraciones, pares, situaciones…) y `levels.ts`, que genera
  los 5 ejercicios de cada página según el nivel y el modo (normal o con ayuda extra), sin repetir lo reciente.
- `src/components/exercises/`: los cuatro motores de ejercicio (elegir, contar, ordenar/completar, clasificar)
  y `LevelRunner`, que reparte pistas escalonadas y nunca muestra errores.
- `src/components/common/GameShell.tsx`: recorrido común reglas → páginas → ejercicios.
- Para ampliar un banco, agregar ítems al archivo de datos; no hace falta tocar los componentes.

## Diseño

- Un libro de tela abierto sobre un escritorio de luz suave (`src/layouts/BookLayout.tsx`). En pantallas anchas
  son dos hojas (portada + índice; en los juegos, Señor Loro a la izquierda y la actividad a la derecha). Desde
  920 px hacia abajo es una sola hoja y Señor Loro pasa a una barra pegada abajo.
- Los colores y tintes de cada capítulo viven como variables en `src/index.css`. El verde azulado (`--accent`)
  se reserva solo para lo que se puede tocar; lo decorativo usa tonos neutros.
- Los emblemas de capítulo son SVG propios (`src/components/common/ChapterEmblem.tsx`).
- Se respeta `prefers-reduced-motion`: sin él, solo hay un fundido corto al cambiar de página y un halo al acertar.

## Imágenes

Las imágenes son emojis suavizados (`src/components/exercises/Picture.tsx`). Para reemplazar alguna por un SVG
propio, cambiar solo ese componente.

## Audio

Para reemplazar la voz del navegador por una grabación real, guardar el archivo en `public/audio/`:

- Palabra suelta: `public/audio/pala.mp3`
- Frase: `public/audio/frases/el-ninyo-juega-en-el-parque.mp3`
- Reglas de cada juego: `public/audio/frases/reglas-phonology.mp3` (y `morphosyntax`, `lexicon`, `pragmatics`, `boss`)

El Panel del docente tiene la lista completa de audios pendientes con el nombre exacto de cada archivo.

La `ñ` se escribe `ny` en el nombre del archivo (`año` → `anyo.mp3`).
