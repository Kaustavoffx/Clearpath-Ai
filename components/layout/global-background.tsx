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
        className="absolute inset-0 bg-[rgba(0,0,0,0.55)] backdrop-blur-[2px]"
      />
    </div>
  );
}
