import React from 'react';
import { FaTasks } from 'react-icons/fa';

interface IconProps {
  className?: string;
}

export const TasksIcon: React.FC<IconProps> = ({ className }) => {
  return <FaTasks className={className} />;
};