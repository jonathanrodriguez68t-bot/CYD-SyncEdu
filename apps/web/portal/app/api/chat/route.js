import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getLowestGradeSubject, getGroupPerformance } from '../../../lib/services/gradesService';

export async function POST(request) {
  try {
    const { prompt, role, username } = await request.json();

    // 1. OBTENER CONFIGURACIONES DE VARIABLES DE ENTORNO
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

    // 2. RUTA PRINCIPAL: ENVIAR A N8N WEBHOOK SI ESTÁ CONFIGURADO
    if (N8N_WEBHOOK_URL) {
      console.log(`[Next.js API] Redirigiendo peticion a n8n Cloud Webhook: ${N8N_WEBHOOK_URL}`);
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, role, username })
        });
        
        if (response.ok) {
          const data = await response.json();
          // Retornar la respuesta estructurada de n8n { text, intent, redirect, audio }
          return NextResponse.json(data);
        } else {
          console.error(`[Next.js API] n8n webhook retorno status error: ${response.status}`);
        }
      } catch (err) {
        console.error('[Next.js API] Error al llamar n8n webhook:', err.message);
      }
    }

    // 3. RUTA SECUNDARIA: LLAMADAS DIRECTAS A OPENAI Y ELEVENLABS (si las claves estan presentes)
    if (OPENAI_API_KEY) {
      console.log('[Next.js API] Usando integracion directa de OpenAI/ElevenLabs (n8n no configurado)');
      try {
        // A. Consultar a OpenAI para clasificar intencion y generar respuesta
        const systemPrompt = `Eres SyncIA, asistente de inteligencia artificial para la plataforma educativa SyncEdu.
El usuario actual tiene el nombre "${username}" y el rol de "${role}" (student, teacher, admin).
Analiza el prompt del usuario y responde de forma breve (máximo 2 oraciones).
Clasifica la intencion del usuario en uno de estos valores:
- "calendar" (si pide proximas actividades, tareas, ferias, fechas, etc.)
- "grades" (si un estudiante pide ver sus notas o promedio)
- "teacher_gradebook" (si un profesor pide calificar, ver notas globales, libro de notas, etc.)
- "suggestions" (cualquier otra consulta o conversacion general)

REGLA DE PERMISOS Y ÁMBITO CRÍTICA:
- Si el usuario pregunta cosas técnicas (como configuraciones de docker, consultas sql, código fuente, scripts, base de datos) o temas fuera del ámbito educativo (poemas, recetas, chistes), debes denegar el acceso. En este caso específico, cambia la intencion a "error_permission", pon la propiedad "redirect" como null, y responde amablemente que por seguridad no tienes permitido responder sobre esos temas y que solo eres un asistente escolar de SyncEdu.
- Si el usuario es un estudiante (role = "student") e intenta pedir calificar actividades o ver el libro de notas del profesor ("teacher_gradebook"), cambia la intencion a "error_permission", pon la propiedad "redirect" como null, y responde amablemente que no cuenta con los permisos necesarios para calificar o acceder al panel docente.

Debes responder UNICAMENTE en formato JSON con la siguiente estructura:
{
  "text": "Tu respuesta en texto corto y claro para el usuario",
  "intent": "calendar | grades | teacher_gradebook | suggestions | error_permission",
  "redirect": "/dashboard/student | /dashboard/teacher | null"
}`;

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (openaiRes.ok) {
          const openaiData = await openaiRes.json();
          const parsed = JSON.parse(openaiData.choices[0].message.content);

          let base64Audio = '';
          // B. Generar voz con ElevenLabs si la clave esta configurada
          if (ELEVENLABS_API_KEY && parsed.text) {
            console.log('[Next.js API] Generando audio de ElevenLabs...');
            try {
              // Rachel Voice ID: 21m00Tcm4TlvDq8ikWAM
              const ttsRes = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'xi-api-key': ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                  text: parsed.text,
                  model_id: 'eleven_multilingual_v2',
                  voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                })
              });

              if (ttsRes.ok) {
                const arrayBuffer = await ttsRes.arrayBuffer();
                base64Audio = Buffer.from(arrayBuffer).toString('base64');
              } else {
                console.error('[Next.js API] ElevenLabs retorno error:', ttsRes.status);
              }
            } catch (ttsErr) {
              console.error('[Next.js API] Error llamando ElevenLabs:', ttsErr.message);
            }
          }

          // Si ElevenLabs fallo o no esta configurado, cargamos un audio de fallback local
          if (!base64Audio) {
            base64Audio = loadLocalAudioBase64(parsed.intent === 'error_permission' ? 'Lo siento no tengo el acceso.mp3' : 'Bienvenida.mp3');
          }

          return NextResponse.json({
            text: parsed.text,
            intent: parsed.intent,
            redirect: parsed.redirect,
            audio: base64Audio
          });
        }
      } catch (err) {
        console.error('[Next.js API] Error en integracion directa:', err.message);
      }
    }

    // 4. RUTA TERCIARIA: SIMULACIÓN LOCAL Y FALLBACK (Sin claves configuradas)
    console.log('[Next.js API] Usando simulación local de intenciones y audio...');
    const lowerPrompt = prompt.toLowerCase();
    let text = '';
    let intent = 'suggestions';
    let redirect = null;
    let audioFileName = 'Bienvenida.mp3';

    // B. Bloquear consultas tecnicas, de programacion o fuera de ambito
    const forbiddenWords = [
      'sql', 'base de datos', 'docker', 'credentials', 'credenciales', 'password',
      'contraseña', 'código', 'code', 'script', 'programar', 'programacion', 'database',
      'query', 'drop table', 'select *', 'config', 'droplet', 'digitalocean', 'n8n workflow',
      'poema', 'chiste', 'receta', 'pizza', 'juego', 'musica', 'cancion'
    ];

    const isTechnicalOrOffTopic = forbiddenWords.some(word => lowerPrompt.includes(word));

    if (isTechnicalOrOffTopic) {
      return NextResponse.json({
        text: "Lo siento, como asistente educativo de SyncEdu, no estoy autorizado para procesar consultas tecnicas, de programacion, seguridad o temas ajenos al ambito escolar.",
        intent: "error_permission",
        redirect: null,
        audio: loadLocalAudioBase64('Lo siento no tengo el acceso.mp3')
      });
    }

    // A. Evaluar permisos y clasificar intenciones
    if (lowerPrompt.includes('calificar') || lowerPrompt.includes('gradebook') || lowerPrompt.includes('notas globales') || lowerPrompt.includes('docente')) {
      if (role === 'student') {
        intent = 'error_permission';
        text = 'Lo siento, no tienes permisos para acceder a esta sección. Esta acción es exclusiva para profesores.';
        redirect = null;
        audioFileName = 'Lo siento no tengo el acceso.mp3';
      } else {
        intent = 'teacher_gradebook';
        text = 'Entendido, abriendo el libro de calificaciones para calificar las actividades pendientes.';
        redirect = '/dashboard/teacher';
      }
    } else if (lowerPrompt.includes('calendario') || lowerPrompt.includes('actividades') || lowerPrompt.includes('agenda')) {
      intent = 'calendar';
      text = 'De acuerdo, aquí tienes las actividades escolares programadas en el calendario.';
      redirect = role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
    } else if (lowerPrompt.includes('mejorar') || lowerPrompt.includes('materia baja') || lowerPrompt.includes('bajo')) {
      // ANALÍTICA: Qué materia debo mejorar
      const analysis = await getLowestGradeSubject(username || 'estudiante');
      if (analysis) {
        text = `Analizando tu expediente académico, la materia con promedio más bajo es ${analysis.subject} con una nota media de ${analysis.average}. Te sugiero repasar sus temas clave.`;
      } else {
        text = 'No he encontrado registros de tus calificaciones en el sistema para calcular qué materia debes mejorar.';
      }
      intent = 'grades';
      redirect = '/dashboard/student';
    } else if (lowerPrompt.includes('rendimiento grupal') || lowerPrompt.includes('promedio del grupo') || lowerPrompt.includes('promedio grupal')) {
      // ANALÍTICA: Rendimiento grupal
      let subject = 'Ciencias';
      if (lowerPrompt.includes('quimica') || lowerPrompt.includes('química')) {
        subject = 'Laboratorio de Quimica';
      } else if (lowerPrompt.includes('matematica') || lowerPrompt.includes('matemática')) {
        subject = 'Matematicas';
      }
      const groupData = await getGroupPerformance(subject);
      if (groupData) {
        text = `El rendimiento promedio grupal en la materia de ${groupData.subject} es de ${groupData.average}, calculado con base en ${groupData.totalGradesCount} notas registradas.`;
      } else {
        text = `No se encontraron registros de calificaciones grupales para la materia ${subject}.`;
      }
      intent = role === 'teacher' ? 'teacher_gradebook' : 'grades';
      redirect = role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
    } else if (lowerPrompt.includes('aviso') || lowerPrompt.includes('anuncio') || lowerPrompt.includes('recordatorio')) {
      text = 'Tienes avisos escolares publicados por tus profesores. Puedes verlos en detalle en tu Muro de Anuncios.';
      intent = 'suggestions';
      redirect = role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
    } else if (lowerPrompt.includes('nota') || lowerPrompt.includes('calificacion') || lowerPrompt.includes('promedio')) {
      if (role === 'teacher') {
        intent = 'teacher_gradebook';
        text = 'Abriendo el registro de notas de los alumnos.';
        redirect = '/dashboard/teacher';
      } else {
        intent = 'grades';
        text = 'Aquí tienes el desglose de tus calificaciones y promedio del periodo actual.';
        redirect = '/dashboard/student';
      }
    } else {
      text = `Hola ${username}, soy tu asistente SyncIA. ¿En qué te puedo colaborar hoy? Puedes consultarme tu calendario o tus notas.`;
      intent = 'suggestions';
      redirect = null;
    }

    const base64Audio = loadLocalAudioBase64(audioFileName);

    return NextResponse.json({
      text,
      intent,
      redirect,
      audio: base64Audio
    });

  } catch (error) {
    console.error('[Next.js API] Error general en el handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper para leer archivos locales de audio y convertirlos a base64
function loadLocalAudioBase64(fileName) {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const audioPath = path.join(publicDir, 'rsc', fileName);
    if (fs.existsSync(audioPath)) {
      const buffer = fs.readFileSync(audioPath);
      return buffer.toString('base64');
    }
  } catch (err) {
    console.error(`[Next.js API] Error al cargar el audio local ${fileName}:`, err.message);
  }
  return '';
}
