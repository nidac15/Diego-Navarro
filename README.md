# Diego Navarro — Portfolio

Portafolio de Diego Andrés Navarro Martín (fotografía y video). Es la base
original del sitio (reconstruida desde la fuente en Open Design) **tal cual**,
con un único cambio sobre el original: el **badge "Made in Framer" está
ocultado** vía CSS (el nodo se conserva para no romper la hidratación del
runtime). El tracking de analytics ya fue eliminado. Todo lo demás se mantiene
igual que el sitio original.

Listo para desplegar en cualquier static host (Vercel, Netlify, GitHub Pages).

## Estructura

```
.
├── index.html        # El sitio completo (entrada de deploy)
├── assets/           # Recursos (imágenes, fuentes, CSS) — self-host local
├── NOTES.md          # Documentación del proyecto (fuente, cambios, gaps)
├── README.md         # Este archivo
└── .gitignore        # Excluye artefactos de trabajo del repo
```

> Nota: `RECON/`, `mirrored/`, `.od-skills/` y `.file-versions/` (artefactos del
> proceso de clonado) están excluidos del repo y no se copian aquí.

## Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En Vercel, `Add New → Project → Import` el repo.
3. Framework Preset: **Other** (estático). Root Directory: `/` (raíz).
4. No requiere build command ni output directory — `index.html` en la raíz.

## Notas

- El sitio carga el runtime y las imágenes desde un CDN externo en tiempo de
  ejecución (igual que el original); `assets/` contiene copias locales de
  respaldo para los recursos.
- El badge "Made in Framer" se oculta mediante una regla CSS inyectada
  (`#__framer-badge-container`), sin eliminar el nodo, para conservar la
  hidratación y la interactividad.
- Los 4 embeds de YouTube requieren red/YouTube en runtime.