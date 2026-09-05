# Diego Navarro — Portfolio (documentación)

## Fuente del sitio

- URL original: `https://second-english-565938.framer.app/`
- Título: Diego Navarro
- Idioma: en (contenido mixto en español: categorías Urban / Concert / Video / Food / Portrait, "Diego Andrés Navarro Martín")
- Generador original: sitio estático con renderizado en servidor e hidratación JS desde un CDN externo.
- Enlaces de contacto reales: WhatsApp (`wa.me/34669998886...`), Instagram (`instagram.com/d.nava01/`), Behance (`behance.net/dnava01`).

## Historia del proyecto

El proyecto nació en Open Design como un clon estático de alta fidelidad del
portafolio de Diego Navarro y después se trabajó en Cursor. En una primera
pasada se intentó una limpieza a fondo del runtime del generador original
(reescritura a HTML/CSS/JS vanilla, `grep=0`). Ese enfoque **cambió el diseño**
y se descartó.

### Decisión final (2026-09-04)

Se vuelve a la **base original de Open Design tal cual**, con un único cambio
sobre el original:

- El **badge "Made in Framer"** está **ocultado** mediante una regla CSS
  inyectada justo después de `<body>`:
  `<style id="od-hide-framer-badge">#__framer-badge-container,#__framer-badge-container *{display:none!important;visibility:hidden!important}</style>`
  El nodo se conserva en el DOM para no romper la hidratación del runtime
  (eliminarlo dispararía un error de hidratación y desactivaría la
  interactividad: animación del hero, pop-ups, menús).
- El **tracking** de analytics (`events.framer.com`) ya se había eliminado.
- **El resto se mantiene igual que el original**: diseño, runtime, animaciones,
  embeds de YouTube, enlaces y contenido.

### Ubicaciones

- **Fuente (Open Design):**
  `...\Open Design\namespaces\release-stable-win\data\projects\7fb72468-293f-42d3-a9b7-639f3687bddd`
  — contiene `RECON/`, `mirrored/`, `.od-skills/`, `.file-versions/` (historial completo). No se toca.
- **Copia para deploy (este directorio):** `C:\Users\PC\Documents\Web Diego Navarro`
  — solo lo que se despliega. Los artefactos de trabajo están excluidos del repo.

## Verificación

- `index.html` es el original (278 KB) con el CSS del badge añadido.
- Servido localmente y comprobado en navegador: el sitio renderiza igual que el
  original (29 imágenes, 4 embeds de YouTube, nav, hero, galerías, footer);
  el badge "Made in Framer" queda oculto y no hay errores de hidratación.

## Despliegue (Vercel)

1. Sube el repositorio a GitHub.
2. En Vercel, `Add New → Project → Import` el repo.
3. Framework Preset: **Other** (estático). Root Directory: `/` (raíz).
4. Sin build command ni output directory — `index.html` en la raíz.

## Notas legales

- El nombre/marca "Diego Andrés Navarro Martín" y el logo "DNAVA" pertenecen al autor; si se despliega públicamente, confirmar con el autor.
- Las fotos del portafolio pertenecen al autor — no redistribuir sin permiso.
- Los 4 embeds de YouTube requieren red/YouTube en runtime.
- El sitio carga runtime e imágenes desde un CDN externo en runtime (comportamiento original); `assets/` contiene copias locales de respaldo.