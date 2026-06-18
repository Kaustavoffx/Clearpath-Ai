import React from 'react';

export function GlobalBackground() {
  return (
    <>
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/background.webp')",
          backgroundAttachment: "fixed" 
        }}
        aria-hidden="true"
      />
      <div 
        className="fixed inset-0 -z-[9] bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(247,249,252,0.72))] dark:bg-[linear-gradient(180deg,rgba(5,8,22,0.72),rgba(5,8,22,0.85))]"
        aria-hidden="true"
      />
    </>
  );
}
