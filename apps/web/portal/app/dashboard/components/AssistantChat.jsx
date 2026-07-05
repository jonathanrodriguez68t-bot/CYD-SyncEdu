'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MediaGallery from './MediaGallery';

export default function AssistantChat({ user, onBack }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [flowTitle, setFlowTitle] = useState(`Hola, ${user?.shortName || ''}`);
  const [flowResponse, setFlowResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('/assets/flow-avatar.jpeg');
  const [isActive, setIsActive] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultBody, setResultBody] = useState(null);
  
  const typingTimerRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const typeText = (text) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setFlowResponse('');
    let index = 0;
    
    typingTimerRef.current = setInterval(() => {
      setFlowResponse((prev) => prev + text.charAt(index));
      index += 1;
      if (index >= text.length) {
        clearInterval(typingTimerRef.current);
      }
    }, 16);
  };

  useEffect(() => {
    if (user) {
      const intro = user.role === 'teacher'
        ? "Puedo ayudarte a mostrar calendario, grupos, actividades por calificar, mensajes o reportes."
        : "Puedo ayudarte a mostrar calendario, notas, cursos, actividades o avisos.";
      typeText(intro);
    }
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [user]);

  const getIntentTitle = (intent) => {
    switch (intent) {
      case 'calendar': return 'Calendario y proximas actividades';
      case 'grades': return 'Calificaciones recientes';
      case 'teacher_gradebook': return 'Panel de Calificaciones Docente';
      case 'error_permission': return 'Acceso Denegado - Permisos Insuficientes';
      default: return 'Sugerencias';
    }
  };

  const askAssistant = async (p) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: p,
          role: user?.role,
          username: user?.username
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.error("Error al consultar API chat:", e);
    }
    return {
      text: "Lo siento, tuve un problema de conexion al procesar tu solicitud.",
      intent: "suggestions",
      redirect: null,
      audio: ""
    };
  };

  const handleComposerSubmit = async (e) => {
    e.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    setIsThinking(true);
    const randomGif = Math.random() > 0.5 ? '/rsc/generating_1.gif' : '/rsc/generating_2.gif';
    setAvatarSrc(randomGif);
    setPrompt('');

    const assistantResult = await askAssistant(cleanPrompt);
    
    // Reproducir audio Base64 de ElevenLabs / Fallback
    if (assistantResult.audio) {
      const snd = new Audio("data:audio/mp3;base64," + assistantResult.audio);
      snd.play().catch(err => console.log("Autoplay de audio bloqueado:", err));
    }

    typeText(assistantResult.text);
    
    // Esperar a que termine de escribir para mostrar resultados
    const readingDelay = assistantResult.text.length * 16 + 800;

    setTimeout(() => {
      setIsActive(true);
      setResultTitle(getIntentTitle(assistantResult.intent));
      setResultBody(assistantResult.intent);
      setIsThinking(false);
      setAvatarSrc('/assets/flow-avatar.jpeg');

      // Redirigir automaticamente si la intencion lo requiere y esta permitida
      if (assistantResult.redirect && assistantResult.intent !== 'error_permission') {
        setTimeout(() => {
          router.push(assistantResult.redirect);
        }, 1600);
      }
    }, readingDelay);
  };

  const renderIntentComponent = (intent) => {
    if (intent === 'calendar') {
      return (
        <div className="card section">
          <h2>Proximas actividades</h2>
          <div className="event">
            <div className="date">07<span>JUL</span></div>
            <div><strong>Exposicion de ciencias</strong><small>Ciencias - Tema: sostenibilidad. Aula 4, 8:00 AM.</small></div>
          </div>
          <div className="event">
            <div className="date">08<span>JUL</span></div>
            <div><strong>Entrega de cartulina</strong><small>Artes visuales - Llevar materiales y boceto del proyecto.</small></div>
          </div>
          <MediaGallery mediaList={[
            {
              type: 'video',
              url: '/rsc/ElevenLabs_video_google-veo-3-1-fast_Genera una anim_2026-07-05T03_10_46.mp4',
              title: 'Guia de Exposicion de Ciencias',
              description: 'Material explicativo de la presentacion en el Aula 4.'
            }
          ]} />
        </div>
      );
    }
    if (intent === 'teacher_gradebook') {
      return (
        <div className="card section">
          <h2>Calificar actividades</h2>
          <table>
            <thead>
              <tr>
                <th>Grupo</th>
                <th>Actividad</th>
                <th>Entregas</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>6B</td>
                <td>Laboratorio de quimica</td>
                <td><strong>18/22</strong></td>
              </tr>
              <tr>
                <td>7A</td>
                <td>Quiz semanal</td>
                <td><strong>21/25</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    if (intent === 'grades') {
      return (
        <div className="card section">
          <h2>Notas recientes</h2>
          <table>
            <thead>
              <tr>
                <th>Materia</th>
                <th>Actividad</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Matematicas</td>
                <td>Examen Unidad 2</td>
                <td><strong>9.0</strong></td>
              </tr>
              <tr>
                <td>Ciencias</td>
                <td>Laboratorio de quimica</td>
                <td><strong>8.5</strong></td>
              </tr>
            </tbody>
          </table>
          <MediaGallery mediaList={[
            {
              type: 'audio',
              url: '/rsc/Bienvenida.mp3',
              title: 'Audio del Docente',
              description: 'Retroalimentacion del profesor sobre el laboratorio.'
            },
            {
              type: 'image',
              url: '/rsc/generating_1.gif',
              title: 'Grafico de Progreso',
              description: 'Rendimiento historico en el periodo actual.'
            }
          ]} />
        </div>
      );
    }
    if (intent === 'error_permission') {
      return (
        <div className="card section" style={{ border: '1px solid #ff4d4f', background: 'rgba(255, 77, 79, 0.04)', padding: '20px' }}>
          <h2 style={{ color: '#ff4d4f', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚠️</span> Acceso Denegado
          </h2>
          <p className="muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
            Tu rol actual de <strong>{user?.label}</strong> no cuenta con la autorizacion ni los permisos academicos requeridos para consultar o interactuar con este modulo docente.
          </p>
        </div>
      );
    }
    return (
      <div className="card section">
        <h2>Sugerencias</h2>
        <div className="grid-2">
          <article className="mini-panel"><h2>Calendario</h2><p className="muted">Pide: muestrame el calendario de mis proximas actividades.</p></article>
          <article className="mini-panel"><h2>Notas</h2><p className="muted">Pide: quiero ver mis notas recientes.</p></article>
        </div>
        <MediaGallery mediaList={[
          {
            type: 'audio',
            url: '/rsc/Lo siento no tengo el acceso.mp3',
            title: 'Nota de Voz de Soporte',
            description: 'Instrucciones del Administrador sobre el acceso.'
          }
        ]} />
      </div>
    );
  };

  return (
    <section className="avatar-portal" id="avatar-portal">
      <header className="avatar-topbar">
        <div className="topbar-brand">
          <div className="mark small">CYD</div>
          <div>
            <strong>SyncEdu</strong>
            <span id="avatar-role-label">Portal Asistente</span>
          </div>
        </div>
        <div className="profile">
          <div>
            <strong id="avatar-profile-name">{user?.name}</strong>
            <span id="avatar-profile-role">{user?.label}</span>
          </div>
          <div className="avatar" id="avatar-profile-badge">{user?.avatar}</div>
          <button className="secondary compact" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <main className={`avatar-workspace ${isActive ? 'avatar-active' : ''}`} id="avatar-workspace">
        <section className={`flow-agent ${isThinking ? 'thinking' : ''}`} id="flow-agent" aria-label="Avatar SyncEdu">
          <div className="flow-avatar-frame">
            <img src={avatarSrc} alt="Avatar asistente SyncEdu" />
            <span className="flow-status">Flow avatar</span>
          </div>
          <div className="flow-copy">
            <span className="eyebrow">SyncIA</span>
            <h1 id="flow-title">{flowTitle}</h1>
            <p id="flow-response">{flowResponse}</p>
          </div>
          <form className="avatar-composer" onSubmit={handleComposerSubmit}>
            <button className="voice-button add-button" type="button">+</button>
            <input
              id="avatar-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Pregunta lo que quieras..."
              autoComplete="off"
            />
            <button className="voice-button" type="button">MIC</button>
            <button className="primary send-button" type="submit">Enviar</button>
          </form>
          {isActive && (
            <button className="secondary compact" style={{ marginTop: '20px' }} onClick={() => {
              setIsActive(false);
              const intro = user.role === 'teacher'
                ? "Puedo ayudarte a mostrar calendario, grupos, actividades por calificar, mensajes o reportes."
                : "Puedo ayudarte a mostrar calendario, notas, cursos, actividades o avisos.";
              typeText(intro);
            }}>
              Volver al inicio
            </button>
          )}
        </section>

        {isActive && (
          <section className="assistant-result" id="assistant-result">
            <div className="assistant-result-head">
              <span>Peticion</span>
              <strong>{resultTitle}</strong>
            </div>
            {renderIntentComponent(resultBody)}
          </section>
        )}
      </main>
    </section>
  );
}
