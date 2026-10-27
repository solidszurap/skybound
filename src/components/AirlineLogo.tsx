import React, { useState } from 'react';

interface AirlineLogoProps {
  airlineCode: string;
  airlineName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AirlineLogo: React.FC<AirlineLogoProps> = ({
  airlineCode,
  airlineName = '',
  size = 'md',
}) => {
  const code = (airlineCode || 'SB').toUpperCase().trim();
  const [imgError, setImgError] = useState(false);

  const dim =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

  const officialLogoUrl = `https://pics.avs.io/200/200/${code}.png`;

  return (
    <div
      title={airlineName || code}
      className={`${dim} rounded-xl overflow-hidden shrink-0 bg-white border border-slate-200/90 shadow-xs flex items-center justify-center p-1`}
    >
      {!imgError ? (
        <img
          src={officialLogoUrl}
          alt={airlineName || code}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      ) : (
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <rect width="48" height="48" rx="10" fill="#0284C7" />
          <path d="M10 28 L26 14 L38 14 L22 28 Z" fill="#38BDF8" />
          <path d="M16 33 L28 22 L38 22 L26 33 Z" fill="#FFFFFF" />
          <text
            x="24"
            y="43"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8"
            fontWeight="800"
          >
            {code}
          </text>
        </svg>
      )}
    </div>
  );
};
