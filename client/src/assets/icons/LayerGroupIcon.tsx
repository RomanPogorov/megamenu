import React from 'react';
import { FaLayerGroup } from 'react-icons/fa';

interface IconProps {
  className?: string;
}

export const LayerGroupIcon: React.FC<IconProps> = ({ className }) => {
  return <FaLayerGroup className={className} />;
};