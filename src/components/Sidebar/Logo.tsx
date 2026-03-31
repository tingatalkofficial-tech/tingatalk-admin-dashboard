import React from 'react';
import logoImg from '../../Assets/logo.png';

const Logo: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Main logo container with brand gradient */}
      <div
        className="w-full py-[28px] px-[28px] flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(145deg, #1a3f39 0%, #1e4841 40%, #234f48 100%)',
        }}
      >
        {/* Subtle decorative glow behind logo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full opacity-[0.08] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #bbf49c 0%, transparent 70%)',
          }}
        />
        <img
          src={logoImg}
          alt="TingaTalk"
          className="h-[44px] w-auto object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        />
      </div>
      {/* Bottom fade line for smooth transition into white sidebar */}
      <div
        className="h-[3px] w-full"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, #bbf49c 50%, transparent 95%)',
          opacity: 0.5,
        }}
      />
    </div>
  );
};

export default Logo;
