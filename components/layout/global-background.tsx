import React from 'react';

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/background.webp')",
          backgroundAttachment: "fixed" 
        }}
      />
      <div 
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(247,249,252,0.72))] dark:bg-[linear-gradient(180deg,rgba(5,8,22,0.72),rgba(5,8,22,0.85))]"
      />
    </div>
  );
}
