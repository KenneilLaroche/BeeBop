import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'yellow' | 'black' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
  const colors = {
    yellow: 'bg-bee-300 text-black border-black',
    black: 'bg-black text-white border-black',
    gray: 'bg-gray-200 text-gray-800 border-gray-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[color]}`}>
      {children}
    </span>
  );
};