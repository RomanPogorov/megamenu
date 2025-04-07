import React from 'react';
import { FaPuzzlePiece } from 'react-icons/fa';

interface IconProps {
  className?: string;
}

export const PluginsIcon: React.FC<IconProps> = ({ className }) => {
  return <FaPuzzlePiece className={className} />;
};