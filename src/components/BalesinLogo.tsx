import React from 'react';

interface BalesinLogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const BalesinLogo: React.FC<BalesinLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  onClick,
}) => {
  // Height sizing mapping
  const heightClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  const iconOnlyHeight = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (variant === 'icon') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center justify-center shrink-0 ${iconOnlyHeight[size]} ${className}`}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_10px_rgba(255,93,0,0.3)]"
        >
          {/* Antennae */}
          <line x1="42" y1="28" x2="32" y2="15" stroke="#FF5D00" strokeWidth="5" strokeLinecap="round" />
          <circle cx="30" cy="12" r="5" fill="#FF5D00" />

          <line x1="78" y1="28" x2="88" y2="15" stroke="#FF5D00" strokeWidth="5" strokeLinecap="round" />
          <circle cx="90" cy="12" r="5" fill="#FF5D00" />

          {/* Cyan Speech Bubble Base & Tail */}
          <path
            d="M 20 60 C 20 32 40 22 60 22 C 80 22 100 32 100 60 C 100 78 86 92 64 92 C 52 92 42 98 26 106 C 28 92 20 82 20 60 Z"
            fill="#00AEEF"
          />

          {/* Circuit details in Cyan section */}
          <path d="M 32 80 L 52 80 M 52 80 L 60 74 M 52 80 L 60 86" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <circle cx="60" cy="74" r="2.5" fill="white" />
          <circle cx="60" cy="86" r="2.5" fill="white" />
          <circle cx="32" cy="80" r="2.5" fill="white" />

          {/* Top Orange Robot Head (Curved S-wave split) */}
          <path
            d="M 20 60 C 20 32 40 22 60 22 C 80 22 100 32 100 60 C 95 72 75 76 60 72 C 42 68 25 76 20 60 Z"
            fill="url(#orangeGrad)"
          />

          {/* Glowing Eyes */}
          <circle cx="44" cy="46" r="8" fill="#00AEEF" />
          <circle cx="46" cy="44" r="2.5" fill="white" />

          <circle cx="76" cy="46" r="8" fill="#00AEEF" />
          <circle cx="78" cy="44" r="2.5" fill="white" />

          {/* Gradients */}
          <defs>
            <linearGradient id="orangeGrad" x1="20" y1="22" x2="100" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF7A00" />
              <stop offset="1" stopColor="#FF4500" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick} 
      className={`inline-flex items-center gap-2.5 select-none ${heightClasses[size]} ${className}`}
    >
      {/* Icon */}
      {variant !== 'text' && (
        <div className="h-full aspect-square shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_2px_12px_rgba(255,93,0,0.35)]"
          >
            {/* Antennae */}
            <line x1="42" y1="28" x2="32" y2="15" stroke="#FF5D00" strokeWidth="5" strokeLinecap="round" />
            <circle cx="30" cy="12" r="5.5" fill="#FF5D00" />

            <line x1="78" y1="28" x2="88" y2="15" stroke="#FF5D00" strokeWidth="5" strokeLinecap="round" />
            <circle cx="90" cy="12" r="5.5" fill="#FF5D00" />

            {/* Cyan Speech Bubble Base & Tail */}
            <path
              d="M 20 60 C 20 32 40 22 60 22 C 80 22 100 32 100 60 C 100 78 86 92 64 92 C 52 92 42 98 26 106 C 28 92 20 82 20 60 Z"
              fill="#00AEEF"
            />

            {/* Circuit details in Cyan section */}
            <path d="M 32 80 L 52 80 M 52 80 L 60 74 M 52 80 L 60 86" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <circle cx="60" cy="74" r="2.5" fill="white" />
            <circle cx="60" cy="86" r="2.5" fill="white" />
            <circle cx="32" cy="80" r="2.5" fill="white" />

            {/* Top Orange Robot Head */}
            <path
              d="M 20 60 C 20 32 40 22 60 22 C 80 22 100 32 100 60 C 95 72 75 76 60 72 C 42 68 25 76 20 60 Z"
              fill="url(#orangeGradFull)"
            />

            {/* Eyes */}
            <circle cx="44" cy="46" r="8" fill="#00AEEF" />
            <circle cx="46" cy="44" r="2.5" fill="white" />

            <circle cx="76" cy="46" r="8" fill="#00AEEF" />
            <circle cx="78" cy="44" r="2.5" fill="white" />

            <defs>
              <linearGradient id="orangeGradFull" x1="20" y1="22" x2="100" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF7A00" />
                <stop offset="1" stopColor="#FF4500" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Brand Text */}
      <div className="flex items-baseline font-black tracking-tight leading-none text-2xl sm:text-3xl font-sans">
        <span className="text-[#FF5D00] font-bold">balesin</span>
        <span className="text-[#00AEEF] font-bold">.ai</span>
      </div>
    </div>
  );
};
