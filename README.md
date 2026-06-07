# LugocciDev — Portafolio

![Quasar](https://img.shields.io/badge/Quasar-2.16-blueviolet?logo=quasar)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

Portafolio profesional de **Isaac González** — desarrollador frontend. Una SPA bilingüe (español / inglés) construida con Vue 3 + Quasar, con modo oscuro/claro automático, diseño responsivo y una línea de tiempo dinámica para mostrar la trayectoria profesional.

## ✨ Características

- 🌐 **Bilingüe** — Español e inglés con detección automática del idioma del navegador
- 🌓 **Modo oscuro/claro** — Sigue la preferencia del sistema con persistencia manual
- 📱 **Responsivo** — Desktop con timeline alternada left/right, mobile con lista simplificada por año
- ⏱️ **Línea de tiempo dinámica** — Motor de posicionamiento temporal con anti-colisión, segmentos de ciclo y markers de año/mes
- 🧩 **Arquitectura agnóstica** — La timeline soporta entradas de tipo `experience`, `achievement`, `award` y `certification` con resolución dinámica de componentes
- 📂 **Datos desde JSON** — Contenido cargado desde `public/data.json`, facilmente extensible
- ⚡ **SSR-ready** — Preparado para server-side rendering con detección de tema y locale desde el servidor

## 🛠️ Stack

| Tecnología                  | Propósito                                      |
| --------------------------- | ---------------------------------------------- |
| **Vue 3** (Composition API) | Framework frontend                             |
| **Quasar 2**                | UI framework con componentes, layout y plugins |
| **Vite 7**                  | Bundler y dev server                           |
| **Vue Router 4**            | Enrutamiento SPA (hash mode para GitHub Pages) |
| **Pinia**                   | Estado global                                  |
| **vue-i18n**                | Internacionalización (ES / EN)                 |
| **Tailwind CSS v4**         | Estilos utilitarios                            |
| **Axios**                   | HTTP client                                    |
| **ESLint + Prettier**       | Linter y formateador                           |

## 📦 Instalación

```bash
git clone https://github.com/IsaacGonzalezDev/Lugoci-sPortfolio-Vue-Quasar-.git
cd Lugoci-sPortfolio-Vue-Quasar-
npm install
```

## 🚀 Desarrollo

```bash
quasar dev
```

Arranca el servidor de desarrollo con hot-reload en `http://localhost:9000`.

## 🏗️ Build producción

```bash
quasar build
```

Genera los assets optimizados en `dist/spa/`.

## 🚢 Deploy a GitHub Pages

```bash
npm run build
npx gh-pages -d dist/spa
```

## 📁 Estructura del proyecto

```
src/
├── boot/           # Archivos de inicialización (i18n, axios)
├── components/     # Componentes Vue reutilizables
│   └── timeline/   # Componentes de la línea de tiempo
│       └── cards/  # Cards por tipo (Experience, Achievement, Award, Certification)
├── composables/    # Compositions functions (useTimelineEngine, useTimelineData)
├── css/            # Estilos globales (Tailwind, variables, temas)
├── i18n/           # Traducciones (es-Es, en-US)
├── layouts/        # Layout principal (MainLayout con drawer responsivo y toolbar)
├── pages/          # Páginas: Home, About, Portfolio, ErrorNotFound
├── router/         # Configuración de rutas
└── stores/         # Stores de Pinia
```

## 📄 Licencia

Proyecto personal — todos los derechos reservados.
