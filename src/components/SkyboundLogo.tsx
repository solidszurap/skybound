import React from 'react';

interface SkyboundLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SKYBOUND_LOGO_URL =
  '/assets/aistudio/681e2e25-7193-4229-8e50-f39179f0868e_abf34f66.jpg';

export const SkyboundLogo: React.FC<SkyboundLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const dim =
    size === 'sm'
      ? 'w-8 h-8 rounded-xl'
      : size === 'lg'
      ? 'w-14 h-14 rounded-2xl'
      : 'w-10 h-10 rounded-2xl';

  return (
    <div
      className={`${dim} relative overflow-hidden shrink-0 bg-[#050E26] border border-cyan-400/35 shadow-md shadow-cyan-500/20 select-none ${className}`}
      aria-label="SKYBOUND"
    >
      <img
        src={SKYBOUND_LOGO_URL}
        alt="SKYBOUND"
        className="w-full h-full object-cover block scale-[1.08]"
      />
    </div>
  );
};
