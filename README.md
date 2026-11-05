# Diego Navarro — Portfolio

Portafolio de fotografía y vídeo de Diego Andrés Navarro Martín.

Sitio **100 % estático** (HTML + CSS + JavaScript sin dependencias). No necesita
build, ni Node, ni ningún servicio externo: todo (páginas, imágenes, vídeos,
fuentes y scripts) se sirve desde este repositorio. Las únicas conexiones
externas son las que el propio contenido enlaza: los vídeos de YouTube del Home
y los enlaces a WhatsApp, Instagram y Behance.

## Estructura

```
.
├── index.html                     # Home
├── about.html                     # /about
├── archivo-don-goa/
│   ├── archive.html               # /archivo-don-goa/archive (archivo completo)
│   ├── archive-urban.html         # categorías (Urban, Concert, Video, Food, Portrait)
│   ├── …
│   └── <proyecto>.html            # 17 páginas de proyecto
├── 404.html
├── assets/
│   ├── img/      # fotos en WebP: <id>-512|1024|2048|4096|full.webp
│   ├── video/    # vídeos y animaciones en WebM (+ MP4 de respaldo para Safari antiguo)
│   ├── fonts/    # Inter (woff2) autoalojada
│   ├── css/      # site.css (estados de interacción), archive.css (filtro del archivo)
│   ├── js/       # site.js (toda la interactividad)
│   └── archive/  # fragmentos HTML que usa el filtro del archivo
├── favicon.png
├── robots.txt
└── vercel.json                    # URLs limpias (/about → about.html) y caché
```

## Despliegue

**Vercel** (recomendado): *Add New → Project → Import* este repositorio.
Framework Preset **Other**, Root Directory `/`, sin build command ni output
directory. `vercel.json` ya activa las URLs limpias (`/about`, `/archivo-don-goa/...`).

También funciona en Netlify, Cloudflare Pages o GitHub Pages (todos sirven
`about.html` cuando se pide `/about`).

## Interactividad (assets/js/site.js)

Reproduce el comportamiento original de la web:

- **Hero del Home**: al pasar el ratón, la foto se expande y recupera el color.
- **Galería del Home**: al pasar el ratón aparecen los datos de la toma
  (ISO, apertura, velocidad, focal); al hacer clic se abre la foto ampliada.
- **Pop-up de contacto** ("Let's work together"): aparece una vez a los 20 s o al
  llegar a la mitad de la página.
- **Menú móvil** (botón hamburguesa).
- **Archivo**: filtro por categoría sin recargar la página y tarjetas con
  título, lugar y fecha al pasar el ratón.
- **Páginas de proyecto**: fotos ampliables y vídeo que se reproduce solo al
  entrar en pantalla.

## Imágenes

Cada foto tiene varias resoluciones en WebP y el navegador elige la adecuada
(`srcset`). Para cambiar una foto, sustituye sus archivos en `assets/img/`
manteniendo los nombres, o añade nuevos y actualiza el `srcset` en el HTML.

## Dominio

Cuando el dominio definitivo esté listo, se puede añadir en cada página
`<link rel="canonical" href="https://tu-dominio/...">` y generar un
`sitemap.xml`.

## Notas legales

- El nombre/marca "Diego Andrés Navarro Martín" y el logo "DNAVA" pertenecen al autor.
- Las fotografías pertenecen al autor: no redistribuir sin permiso.
