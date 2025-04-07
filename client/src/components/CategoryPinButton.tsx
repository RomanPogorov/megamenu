import React from 'react';
import { FaThumbtack, FaTimes } from 'react-icons/fa';
import { Category } from '../types/menu';

interface CategoryPinButtonProps {
  category: Category;
  isPinned: (id: string) => boolean;
  handlePinToggle: (category: Category) => void;
}

const CategoryPinButton: React.FC<CategoryPinButtonProps> = ({ 
  category, 
  isPinned, 
  handlePinToggle 
}) => {
  const isPinnedCategory = isPinned(category.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlePinToggle(category);
  };

  return (
    <button
      className={`${isPinnedCategory ? 'text-red-500 hover:text-red-600' : 'text-gray-300 hover:text-red-500'} 
        transition-colors flex-shrink-0 p-1 rounded-full`}
      aria-label={isPinnedCategory ? `Открепить ${category.name}` : `Прикрепить ${category.name}`}
      title={isPinnedCategory ? `Открепить ${category.name}` : `Прикрепить ${category.name}`}
      onClick={handleClick}
    >
      {isPinnedCategory ? <FaTimes size={14} /> : <FaThumbtack size={14} />}
    </button>
  );
};

export default CategoryPinButton;