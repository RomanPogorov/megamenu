import React from 'react';
import { FaBook } from 'react-icons/fa';

interface IconProps {
  className?: string;
}

export const NotebookIcon: React.FC<IconProps> = ({ className }) => {
  return <FaBook className={className} />;
};