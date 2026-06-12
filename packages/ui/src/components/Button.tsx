import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const isPrimary = variant === 'primary';
  
  return (
    <button
      style={{
        backgroundColor: isPrimary ? '#FF3366' : 'transparent',
        color: '#FFFFFF',
        border: isPrimary ? 'none' : '1px solid #27272A',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 0.2s ease'
      }}
      {...props}
    >
      {children}
    </button>
  );
};
