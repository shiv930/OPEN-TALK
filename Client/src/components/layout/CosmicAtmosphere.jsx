import React from 'react';

export default function CosmicAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none select-none"
      style={{
        backgroundImage: 'linear-gradient(125deg, rgba(76, 184, 184, 0.08), transparent 42%), linear-gradient(305deg, rgba(215, 131, 118, 0.055), transparent 36%), repeating-linear-gradient(0deg, rgba(44, 44, 44, 0.018) 0, rgba(44, 44, 44, 0.018) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(44, 44, 44, 0.018) 0, rgba(44, 44, 44, 0.018) 1px, transparent 1px, transparent 32px)',
      }}
    />
  );
}
