'use client'

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function GlobalBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (resolvedTheme !== 'dark') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[-50] pointer-events-none" aria-hidden="true">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/background.webp')",
          backgroundAttachment: "fixed" 
        }}
      />
      <div 
        className="absolute inset-0 bg-[rgba(4,10,18,0.72)] backdrop-blur-[2px]"
      />
    </div>
  );
}
