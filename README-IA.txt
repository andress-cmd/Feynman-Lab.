FEYNMAN LAB — IA DIRECTA

Estructura:
- index.html: página
- api/ai.js: backend seguro para llamar a OpenAI
- package.json: configuración mínima

IMPORTANTE:
No pongas OPENAI_API_KEY dentro de index.html.
La clave debe quedar como variable de entorno del servidor.

Para despliegue en Vercel:
1. Importa este proyecto.
2. Configura la variable de entorno OPENAI_API_KEY.
3. Opcional: configura OPENAI_MODEL (por defecto gpt-5.6-luna).
4. Publica.
5. La página llamará a /api/ai y la respuesta aparecerá dentro de la misma página.

GitHub Pages por sí solo no ejecuta api/ai.js; si mantienes GitHub Pages como frontend, necesitas alojar este backend en un servicio de funciones/serverless y poner su URL en el fetch del index.html.
