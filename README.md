# Tu Próxima Aventura · Landing

## Uso
    npm install
    npm run dev      # desarrollo
    npm run build    # compila a /dist

## Vercel
Importa el repositorio: framework Vite, build `npm run build`, salida `dist`. GitHub Pages en subruta: cambia `base` en `vite.config.js`.

## Personalizar
- **WhatsApp:** `whatsappNumber` en `src/config.js` (`593` + móvil sin el 0, 12 dígitos). Mientras sea el placeholder, los enlaces quedan desactivados y se muestra un aviso.
- **Imágenes:** coloca WebP en `public/images/` con los nombres de `src/config.js` (hero, 5 playas, 3 de la furgoneta). Si faltan, se ven placeholders.
- **Tarifas, nombre y horarios:** solo en `src/config.js`.

## Antes de publicar
Número real, fotos reales (con licencia), probar los enlaces de WhatsApp, correr Lighthouse, añadir `canonical`/`sitemap` cuando exista el dominio.
