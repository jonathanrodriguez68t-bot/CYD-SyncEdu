'use client';

import React from 'react';

export default function MediaGallery({ mediaList }) {
  if (!mediaList || mediaList.length === 0) return null;

  return (
    <div className="media-gallery" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '16px',
      marginTop: '16px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {mediaList.map((item, index) => (
        <div key={index} className="media-card" style={{
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          background: 'rgba(15, 17, 22, 0.45)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {item.title && (
            <strong style={{ fontSize: '14px', color: '#f8fafc' }}>
              {item.title}
            </strong>
          )}
          
          <div className="media-content" style={{
            position: 'relative',
            width: '100%',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#000',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {item.type === 'image' && (
              <img
                src={item.url}
                alt={item.title || 'Media Image'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
            
            {item.type === 'video' && (
              <video
                src={item.url}
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
            
            {item.type === 'audio' && (
              <div style={{
                padding: '20px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1d8fff, #0b63ce)',
                height: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '24px', marginBottom: '8px' }}>🎵</span>
                <audio
                  src={item.url}
                  controls
                  style={{ width: '100%', height: '36px' }}
                />
              </div>
            )}
          </div>
          {item.description && (
            <small style={{ color: '#98a2b3', fontSize: '12px', marginTop: '4px' }}>
              {item.description}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}
