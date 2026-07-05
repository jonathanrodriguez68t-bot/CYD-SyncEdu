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
    
    // Seed chat list
    setChatMessages([
      { role: 'bot', text: `Hola ${user.shortName}, soy SyncIA. Puedo ayudarte segun tu rol: ${user.label}.` },
      { role: 'user', text: 'Que debo atender hoy?' },
      { role: 'bot', text: user.role === 'teacher' 
        ? "Tienes 11 entregas por calificar y puedes agregar nuevas actividades al calendario."
        : user.role === 'admin'
        ? "Hay 9 solicitudes abiertas y 3 expedientes pendientes de validacion."
        : "Hay exposicion de ciencias el 7 de julio y entrega de cartulina el 8. Tambien conviene repasar Matematicas." }
    ]);

    // For students and teachers, default view is the flow agent avatar chat!
    if (user.role !== 'admin') {
      setCurrentView('chat-ia');
    }
  }, [router]);

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

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      const botText = currentUser.role === 'teacher'
        ? "Tienes 11 entregas por calificar y puedes agregar nuevas actividades al calendario."
        : currentUser.role === 'admin'
        ? "Hay 9 solicitudes abiertas y 3 expedientes pendientes de validacion."
        : "Hay exposicion de ciencias el 7 de julio y entrega de cartulina el 8. Tambien conviene repasar Matematicas.";
      setChatMessages((prev) => [...prev, { role: 'bot', text: botText }]);
    }, 400);
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
      <section className={`chat ${isChatOpen ? '' : 'minimized'}`} id="chat" aria-label="Chatbot SyncIA">
        <div className="chat-head" onClick={() => setIsChatOpen(!isChatOpen)}>
          <div>
            <strong>SyncIA</strong>
            <small>Asistente del portal</small>
          </div>
          <span className="status-dot" aria-hidden="true"></span>
        </div>
        <div className="messages" id="messages" style={{ overflowY: 'auto', maxHeight: '240px' }}>
          {chatMessages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={handleChatSubmit}>
          <input 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            aria-label="Mensaje para SyncIA" 
            placeholder="Preguntar a SyncIA..." 
          />
          <button aria-label="Enviar">&gt;</button>
        </form>
      </section>
    </div>
  );
}
