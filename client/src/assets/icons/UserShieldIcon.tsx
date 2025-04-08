import React from 'react';
import { FaUserShield } from 'react-icons/fa';

interface IconProps {
  className?: string;
}

export const UserShieldIcon: React.FC<IconProps> = ({ className }) => {
  return <FaUserShield className={className} />;
};