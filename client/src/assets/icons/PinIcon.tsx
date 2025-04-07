import React from 'react';

interface IconProps {
  className?: string;
}

export const PinIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      className={className}
      width="14" 
      height="14" 
      viewBox="0 0 448 512" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M257.5 280.5C261.6 284.1 266.4 288 272 288C277.6 288 282.4 284.1 286.5 280.5L446.8 120.2C451.6 115.4 451.6 107.6 446.8 102.8C442 98 434.2 98 429.4 102.8L272 260.2L114.6 102.8C109.8 98 101.1 98 97.2 102.8C92.4 107.6 92.4 115.4 97.2 120.2L257.5 280.5zM429.4 409.2C434.2 404.4 442 404.4 446.8 409.2C451.6 414 451.6 421.8 446.8 426.6L286.5 586.9C282.4 590.5 277.6 592 272 592C266.4 592 261.6 590.5 257.5 586.9L97.2 426.6C92.4 421.8 92.4 414 97.2 409.2C101.1 404.4 109.8 404.4 114.6 409.2L272 566.6L429.4 409.2z" />
    </svg>
  );
};