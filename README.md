# LOS REYES DEL TRUCO 🃏👑

Proyecto independiente. No modifica ni depende de TÍO CUCHO LIVE.

Incluye una interfaz web móvil en español, diseño negro/dorado, creación e ingreso a salas, invitación por WhatsApp, 20 ventanas visuales, panel del anfitrión y una base de servidor seguro para emitir tokens LiveKit y expulsar participantes.

IMPORTANTE: La interfaz es una base de proyecto y vista previa; todavía NO es una videollamada real. Para activar audio/vídeo sincronizado, hay que integrar LiveKit Client y configurar las credenciales LiveKit en variables de entorno. No pongas secretos en el HTML ni en GitHub.

## Render
1. Crea un repositorio GitHub NUEVO y sube el contenido de este proyecto.
2. En Render crea un Web Service desde ese repositorio y elige Docker.
3. Añade variables secretas: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET y HOST_ACCESS_PASSWORD.
4. Opcional: APP_ORIGIN con la URL pública exacta.
5. Health check: /health.

## Identidad visual
La imagen de portada de truco argentino está en `public/los-reyes-banner.png`. La página la muestra como imagen decorativa; los controles reales están debajo y no forman parte de la imagen.
