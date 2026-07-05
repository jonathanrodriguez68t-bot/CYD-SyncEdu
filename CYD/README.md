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
2. Abre `index.html`.
3. Usa Live Server o abre el archivo directamente en el navegador.

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

## Proxima fase

Despues se conectara el login y los datos con una base de datos real.
