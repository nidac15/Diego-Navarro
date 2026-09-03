# Diego Navarro — Portfolio

Sitio estático y autónomo del portafolio de Diego Andrés Navarro Martín.
Página única HTML, lista para desplegar en cualquier static host (Vercel,
Netlify, GitHub Pages).

## Estructura

```
.
├── index.html        # El sitio completo (entrada de deploy)
├── favicon.svg       # Icono del sitio
├── assets/           # Recursos auto-alojados (fuentes + imágenes) — self-host
├── NOTES.md          # Documentación del proyecto (fuente, licencia, gaps)
└── .gitignore        # Excluye artefactos de trabajo del repo
```

## Deploy en Vercel

1. Sube este repositorio a GitHub.
2. En Vercel, `Add New → Project → Import` el repo.
3. Framework Preset: **Other** (estático). Root Directory: `/` (raíz).
4. No requiere build command ni output directory — `index.html` en la raíz.

## Notas

- Las fuentes son auto-alojadas en `assets/fonts/`.
- Las imágenes se sirven desde un CDN externo; la copia local en
  `assets/images/` está preparada para sustituir el CDN si se desea funcionar
  totalmente offline.