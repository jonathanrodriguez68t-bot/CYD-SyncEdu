'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AssistantChat from './components/AssistantChat';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);
    
    // Seed chat list with clean penguin welcome message
    setChatMessages([
      { role: 'bot', text: `Hola ${user.shortName}, soy SyncIA. ¿En qué te puedo ayudar hoy?` }
    ]);

    // For students and teachers, default view is the flow agent avatar chat!
    if (user.role !== 'admin') {
      setCurrentView('chat-ia');
    }
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;
    
    const handleTriggerPrompt = async (e) => {
      const promptText = e.detail;
      await submitFloatingChat(promptText);
    };

    window.addEventListener('trigger-chat-prompt', handleTriggerPrompt);
    return () => {
      window.removeEventListener('trigger-chat-prompt', handleTriggerPrompt);
    };
  }, [currentUser]);

  if (!currentUser) {
    return <div style={{ padding: '24px', background: '#111827', minHeight: '100vh', color: '#f8fafc' }}>Cargando portal de SyncEdu...</div>;
  }

  // If the view is the SyncIA assistant full view (for student/teacher), render the AssistantChat full page
  if (currentView === 'chat-ia' && currentUser.role !== 'admin') {
    return (
      <AssistantChat 
        user={currentUser} 
        onBack={() => {
          setCurrentView('home');
          router.push(`/dashboard/${currentUser.role}`);
        }} 
        onRedirect={(targetPath, userText, botText) => {
          setChatMessages((prev) => [
            ...prev,
            { role: 'user', text: userText },
            { role: 'bot', text: botText }
          ]);
          setIsChatOpen(true);
          setCurrentView('home');
          router.push(targetPath);
        }}
      />
    );
  }

  const submitFloatingChat = async (promptText) => {
    if (!promptText.trim()) return;

    const userText = promptText.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsChatOpen(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          role: currentUser.role,
          username: currentUser.username
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { role: 'bot', text: data.text }]);

        if (data.audio) {
          const snd = new Audio("data:audio/mp3;base64," + data.audio);
          snd.play().catch(err => console.log("Audio block:", err));
        }

        if (data.redirect && data.intent !== 'error_permission') {
          router.push(data.redirect);
        }
      }
    } catch (err) {
      console.error("Error en chat flotante:", err);
      setChatMessages((prev) => [...prev, { role: 'bot', text: "Lo siento, hubo un problema al procesar tu solicitud." }]);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');
    submitFloatingChat(text);
  };

  return (
    <div className={`app ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} id="app">
      <Sidebar 
        user={currentUser}
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'chat-ia' && currentUser.role !== 'admin') {
            setCurrentView('chat-ia');
          } else {
            setCurrentView(view);
            router.push(`/dashboard/${currentUser.role}?view=${view}`);
          }
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="main">
        <Topbar user={currentUser} />
        <div style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      </main>

      {/* Floating Chat widget for admin and fallback */}
      <section className={`chat ${isChatOpen ? '' : 'minimized'}`} id="chat" aria-label="Chatbot SyncIA" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0f1116' }}>
        <div className="chat-head" onClick={() => setIsChatOpen(!isChatOpen)} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#171922', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src="/assets/flow-avatar.jpeg" alt="SyncIA" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ flexGrow: 1 }}>
            <strong style={{ display: 'block', fontSize: '13px', color: '#f8fafc' }}>SyncIA</strong>
            <small style={{ display: 'block', fontSize: '11px', color: '#98a2b3' }}>Asistente del portal</small>
          </div>
          <span className="status-dot" aria-hidden="true" style={{ background: '#12b76a', width: '8px', height: '8px', borderRadius: '50%' }}></span>
        </div>
        <div className="messages" id="messages" style={{ overflowY: 'auto', maxHeight: '240px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chatMessages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', width: '100%', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'bot' && (
                <img src="/assets/flow-avatar.jpeg" alt="Avatar" style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
              )}
              <div style={{
                background: msg.role === 'bot' ? 'rgba(255,255,255,0.06)' : '#1d8fff',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '12px',
                maxWidth: '75%',
                fontSize: '12.5px',
                lineHeight: '1.4',
                wordBreak: 'break-word',
                border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.04)' : 'none'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <input 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            aria-label="Mensaje para SyncIA" 
            placeholder="Preguntar a SyncIA..." 
            style={{ flexGrow: 1, background: '#171922', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '999px', padding: '8px 14px', fontSize: '12.5px', outline: 'none' }}
          />
          <button aria-label="Enviar" style={{ background: '#1d8fff', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>&gt;</button>
        </form>
      </section>
    </div>
  );
}
