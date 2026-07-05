# CYD SyncEdu - Portal Prototype

Prototipo visual inicial del dashboard SyncEdu.

## Estructura

```txt
syncedu-portal-prototype/
|-- index.html
|-- css/
|   `-- styles.css
|-- js/
|   `-- app.js
`-- README.md
```

## Como abrirlo

1. Abre esta carpeta en Visual Studio Code.
2. Para el prototipo sin OpenAI, abre `index.html` o usa Live Server.
3. Para usar OpenAI, ejecuta el servidor local:

```bash
set OPENAI_API_KEY=tu_api_key
npm start
```

Luego abre:

```txt
http://127.0.0.1:4173
```

## Usuarios de prueba

```txt
estudiante / 1234
profesor / 1234
admin / 1234
```

## Incluye

- Portal con avatar para estudiante.
- Portal con avatar para profesor.
- Vista del administrador.
- Login local sin base de datos.
- Calendario compartido.
- Chat flotante SyncIA.
- Dashboard responsive.

## Flujo avatar

Estudiante y profesor entran a una interfaz de asistente. El avatar inicia al
centro; cuando el usuario pide calendario, notas, cursos, avisos o calificar,
el avatar se mueve a la izquierda y el resultado aparece al centro.

El avatar actual es solo visual. Luego puede reemplazarse por el avatar de Flow.

## OpenAI

El frontend llama a `/api/assistant`. La API key no va en el navegador; se lee
desde `OPENAI_API_KEY` en `server.js`. Si no hay API configurada, el prototipo
usa un enrutador local como respaldo.

## Proxima fase

Despues se conectara el login y los datos con una base de datos real.
