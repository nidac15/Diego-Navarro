# Diego Navarro — Portfolio (documentación)

## Fuente del sitio

- URL original (publicado en el dominio de la plataforma del generador): `second-english-565938`
- Título: Diego Navarro
- Idioma: en (contenido mixto en español: categorías Urban / Concert / Video / Food / Portrait, "Diego Andrés Navarro Martín")
- Generador original: sitio estático con renderizado en servidor e hidratación JS desde un CDN externo.
- Enlaces de contacto reales: WhatsApp (`wa.me/34669998886...`), Instagram (`instagram.com/d.nava01/`), Behance (`behance.net/dnava01`).

## Historia del proyecto

El proyecto nació en Open Design como un clon estático de alta fidelidad del
portafolio de Diego Navarro. Después se trabajó en Cursor. El objetivo final:
dejar una carpeta limpia, autónoma y sin dependencias del runtime del generador
original, lista para subir a GitHub y desplegar en Vercel.

### Ubicaciones

- **Fuente (Open Design):**
  `...\Open Design\namespaces\release-stable-win\data\projects\7fb72468-293f-42d3-a9b7-639f3687bddd`
  — contiene `RECON/`, `mirrored/`, `.od-skills/`, `.file-versions/` (historial completo de clonado). No se toca.
- **Copia limpia (este directorio):** `C:\Users\PC\Documents\Web Diego Navarro`
  — solo lo que se despliega. El UUID de Open Design no se renombra in-place porque rompería Open Design.

## Fase 1 — Rastro visible, sin romper el sitio (completada)

Trabajado solo sobre la copia. El sitio seguía dependiendo del runtime externo
para animaciones/interactividad (no se tocó en esta fase).

Quitado de `index.html`:
- `meta name="generator"` y el `meta` de índice de búsqueda (`search-index`) y su fallback
- Favicons del CDN original → `favicon.svg` local (placeholder genérico)
- Script de editor (`.../edit/init.mjs`) y la variable de forzado de editorbar (`__force_showing_editorbar_since`)
- `canonical` y `og:url` del subdominio original `second-english-565938` → `/` (placeholder)
- Comentarios de export (`headStart`/`headEnd`/`bodyStart`/`bodyEnd`)
- Texto de marketing "Create a free website…"
- Bloque `@font-face` desde CDN → `<link rel="stylesheet" href="assets/fonts/fonts.css">`

Fuentes:
- La carpeta de fuentes descargadas de `assets/fonts/` (con el nombre del CDN del generador) → renombrada a `assets/fonts/inter/`
- `fonts.css` actualizado (60 `@font-face`, todos a `url("inter/…")`, 0 menciones del generador en la hoja)

`README.md` reescrito para deploy sin mencionar el generador original.

## Fase 2 — Auditoría y reescritura a HTML/CSS/JS vanilla (completada)

### Auditoría (fase 2a)

Se extrajo y analizó el cuerpo minificado del SSR para reconstruir la estructura:

- **Header** (3 variantes: desktop / tablet / móvil): logo "DNAVA", menú
  (Home / Archive / About), iconos de Instagram y Behance, botón hamburguesa en móvil.
- **Hero**: título "DIEGO NAVARRO" (Inter 900, uppercase) + cuadrícula de 5 fotos-categoría:
  Urban, Concert, Video, Food, Portrait.
- **Galerías**: 5 secciones apiladas, una por categoría. Cada una con título y
  cuadrícula de 6 fotos (la sección Video usa 4 embeds de YouTube en fondo negro).
- **Footer** (3 variantes): identidad (DNAVA, nombre completo, "All rights reserved"),
  redes, y accesos directos (Home, Urban, Food, Archive, Concert, Portrait, About, Video, Contact).
- **CTA**: botón flotante de WhatsApp.
- **Breakpoints**: `1200px`, `810px` y `809px`.
- Las fotos vienen del CDN original; se mapearon a las copias locales
  (`assets/images/photos/`) eligiendo el archivo de mayor tamaño por imagen.

### Reescritura (fase 2b)

- `index.html` reconstruido a mano en HTML semántico (sin clases generadas ni
  atributos `data-*` del generador). Se corrigió la descripción `meta` (mojibake).
- `assets/css/style.css`: CSS vanilla (paleta blanco/negro + acento `#0099ff`,
  Inter, responsive 3/2/1 columnas, hover, reveal-on-scroll).
- `assets/js/main.js`: JS vanilla (menú móvil, reveal con IntersectionObserver,
  sombra del header al hacer scroll). Sin dependencias.
- YouTube con `iframe` nativo (sin reproductor del CDN).
- Imágenes y fuentes 100% locales.

### Eliminado

- `modulepreload` y scripts del runtime del generador, atributos `data-*` de
  hidratación, clases y variables CSS generadas (prefijos del generador),
  nodos del badge (ya no existen en el SSR).
- Carpetas con el nombre del CDN del generador: `assets/images/<nombre-generador>/` → `assets/images/photos/`.
- Restos del reproductor de YouTube del CDN: `assets/css/www.youtube.com/`,
  `assets/images/i.ytimg.com/`, `assets/images/www.youtube.com/`,
  `assets/images/www.gstatic.com/`, `assets/images/yt3.ggpht.com/`,
  `assets/images/fonts.gstatic.com/`, `assets/fonts/fonts.gstatic.com/`, `svg--*.bin`.

## Verificación

- `grep -i` del nombre del generador = 0 en toda la carpeta de deploy
  (HTML/CSS/JS/assets/docs).
- Servido en local y abierto con Edge headless: 29 imágenes (todas locales),
  4 embeds de YouTube, 5 secciones, menú móvil, footer y CTA presentes;
  CSS/JS cargados y ejecutándose sin errores.
- Screenshots de verificación en el directorio temporal de trabajo.

## Despliegue (Vercel)

1. Sube el repositorio a GitHub.
2. En Vercel, `Add New → Project → Import` el repo.
3. Framework Preset: **Other** (estático). Root Directory: `/` (raíz).
4. Sin build command ni output directory — `index.html` en la raíz.

## Notas legales

- El nombre/marca "Diego Andrés Navarro Martín" y el logo "DNAVA" pertenecen al autor; si se despliega públicamente, confirmar con el autor.
- Las fotos del portafolio pertenecen al autor — no redistribuir sin permiso.
- Los 4 embeds de YouTube requieren red/YouTube en runtime.