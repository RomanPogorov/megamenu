import React from "react";
import "../assets/icons/icons.css";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = "", size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <span
      className={`icon ${name} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  );
};
