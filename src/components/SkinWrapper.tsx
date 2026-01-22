// src/components/SkinWrapper.tsx
// Wrapper global pour l'habillage publicitaire panoramique

import React from 'react';

interface SkinWrapperProps {
  children: React.ReactNode;
}

const SkinWrapper: React.FC<SkinWrapperProps> = ({ children }) => {
  return (
    <>
      {/* Background skin fixe */}
      <div
        className="skin-background"
        aria-hidden="true"
      />

      {/* Contenu principal qui passe par-dessus */}
      <div className="skin-content">
        {children}
      </div>
    </>
  );
};

export default SkinWrapper;
