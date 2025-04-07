import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { 
  FaTimes, 
  FaSearch, 
  FaFolderOpen, 
  FaBook, 
  FaCode, 
  FaDatabase, 
  FaUserShield, 
  FaTasks, 
  FaPuzzlePiece,
  FaThumbtack
} from "react-icons/fa";
import { useMenu } from "../hooks/useMenu";
import { useSearch } from "../hooks/useSearch";
import MenuItem from "./MenuItem";
import SearchResults from "./SearchResults";
import { Category } from "../types/menu";

// Компонент кнопки закрепления категории
const CategoryPinButton = ({ category, isPinned, handlePinToggle }: { 
  category: Category, 
  isPinned: (id: string) => boolean,
  handlePinToggle: (category: Category) => void 
}) => {
  const categoryId = `category-${category.id}`;
  const isPinnedValue = isPinned(categoryId);
  
  return (
    <button
      className={`${isPinnedValue ? 'text-red-500' : 'text-gray-300'} hover:text-red-500 transition-colors flex-shrink-0`}
      aria-label={isPinnedValue ? `Открепить ${category.name}` : `Прикрепить ${category.name}`}
      title={isPinnedValue ? `Открепить ${category.name}` : `Прикрепить ${category.name}`}
      onClick={(e) => {
        e.stopPropagation();
        handlePinToggle(category);
      }}
    >
      <FaThumbtack />
    </button>
  );
};

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  const [, setLocation] = useLocation();
  const { allMenuItems, categories, pinnedItems, addToPinned, removeFromPinned, trackRecentItem, isPinned, getCategoryIcon } = useMenu();
  const { 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    searchResultsByCategory,
    activeFilter,
    setActiveFilter,
    filterOptions
  } = useSearch();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Reset search when closing the menu
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setActiveFilter("all");
    }
  }, [isOpen, setSearchQuery, setActiveFilter]);

  const handleItemClick = (categoryId: string, itemId: string) => {
    // Track the item in recent history
    trackRecentItem({
      id: itemId,
      name: allMenuItems.find(item => item.id === itemId)?.name || "",
      category: categoryId,
      icon: allMenuItems.find(item => item.id === itemId)?.icon || "",
    });
    
    // Navigate to the item page
    setLocation(`/resource/${itemId}`);
    onClose();
  };

  const handlePinToggle = (itemId: string) => {
    if (isPinned(itemId)) {
      removeFromPinned(itemId);
    } else {
      const item = allMenuItems.find(item => item.id === itemId);
      if (item) {
        addToPinned({
          id: item.id,
          name: item.name,
          icon: item.icon,
          category: item.category,
          parentId: item.parentId
        });
      }
    }
  };
  
  const handleCategoryPinToggle = (category: Category) => {
    const categoryId = `category-${category.id}`;
    
    if (isPinned(categoryId)) {
      removeFromPinned(categoryId);
    } else {
      // Создаем родительский элемент и добавляем его в закрепленные
      addToPinned({
        id: categoryId,
        name: category.name,
        icon: category.icon,
        category: category.id,
        isParent: true
      });
    }
  };

  // Animation flags
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    let searchTimer: NodeJS.Timeout;
    let contentTimer: NodeJS.Timeout;
    
    if (isOpen) {
      // Show search bar immediately
      setShowSearchBar(true);
      
      // Задержка появления контента (уменьшена)
      contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 200); // Уменьшенная задержка для контента
    } else {
      // Reset states when closed
      setShowSearchBar(false);
      setShowContent(false);
    }
    
    return () => {
      clearTimeout(searchTimer);
      clearTimeout(contentTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-40 ml-[60px]">
      <div 
        ref={menuRef}
        className="w-full h-full overflow-auto relative"
      >
        {/* Убираем крестик из мегаменю, оставляем только в боковом меню */}
          
        {/* Основная часть мегаменю */}
        <div className="w-full">
          {/* Header section with search */}
          <div className={`transition-all duration-300 transform ${showSearchBar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            {/* Search input - на всю ширину */}
            <div className="pt-3 px-6 pb-4">
              <div className="relative max-w-4xl mx-auto">
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Поиск в меню..." 
                  className="w-full px-4 py-2 pl-10 border border-red-500 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-3 text-red-500" />
              </div>
            </div>
          </div>
            
          {/* Content section - fades in with delay (ускоренная анимация) */}
          <div className={`transition-all duration-250 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {searchQuery ? (
              // Search Results State
              <SearchResults 
                results={searchResults}
                resultsByCategory={searchResultsByCategory}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                filterOptions={filterOptions}
                onItemClick={handleItemClick}
              />
            ) : (
              // Initial Menu State - Fullscreen version
              <div className="px-16 pb-8 container mx-auto">
                {/* Top Navigation Buttons */}
                <div className="flex space-x-4 mb-8 max-w-4xl mx-auto">
                  <button className="px-5 py-3 bg-white border border-gray-200 rounded-lg flex items-center text-red-500 transition-colors shadow-sm">
                    <FaFolderOpen className="mr-2 text-red-500" />Resource Browser
                  </button>
                  <button className="px-5 py-3 bg-white border border-gray-200 rounded-lg flex items-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                    <FaCode className="mr-2 text-red-500" />REST Console
                  </button>
                  <button className="px-5 py-3 bg-white border border-gray-200 rounded-lg flex items-center text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                    <FaDatabase className="mr-2 text-red-500" />DB Console
                  </button>
                </div>
                
                {/* Menu Categories Grid - новая структура */}
                <div className="flex max-w-7xl mx-auto">
                  {/* Resources колонка (занимает всю высоту слева) */}
                  <div className="w-1/4 pr-8">
                    {categories
                      .filter(category => category.id === 'resources')
                      .map((category: Category) => (
                        <div key={category.id} className="mb-8">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <FaFolderOpen className="text-red-500 mr-2" />
                              <h3 className="font-medium text-red-500">{category.name}</h3>
                            </div>
                            <CategoryPinButton 
                              category={category} 
                              isPinned={isPinned} 
                              handlePinToggle={handleCategoryPinToggle} 
                            />
                          </div>
                          
                          {/* Для Resources добавляем увеличенную высоту и скролл */}
                          <ul className="h-[640px] overflow-y-auto pr-2 space-y-3">
                            {allMenuItems
                              .filter(item => item.category === category.id)
                              .map(item => (
                                <MenuItem 
                                  key={item.id} 
                                  item={item} 
                                  isPinned={isPinned(item.id)}
                                  onPinToggle={() => handlePinToggle(item.id)}
                                  onClick={() => handleItemClick(category.id, item.id)}
                                  isChild={!!item.parentId}
                                  parentIcon={getCategoryIcon(item.category)}
                                />
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                  
                  {/* Остальные категории (в правой части) */}
                  <div className="w-3/4 grid grid-cols-3 gap-8">
                    {/* Верхний ряд (Notebooks, API, Database) */}
                    <div className="mb-8">
                      {categories
                        .filter(category => category.id === 'notebooks')
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <FaBook className="text-red-500 mr-2" />
                                <h3 className="font-medium text-red-500">{category.name}</h3>
                              </div>
                              <CategoryPinButton 
                                category={category} 
                                isPinned={isPinned} 
                                handlePinToggle={handleCategoryPinToggle} 
                              />
                            </div>
                            
                            <ul className="space-y-3">
                              {allMenuItems
                                .filter(item => item.category === category.id)
                                .map(item => (
                                  <MenuItem 
                                    key={item.id} 
                                    item={item} 
                                    isPinned={isPinned(item.id)}
                                    onPinToggle={() => handlePinToggle(item.id)}
                                    onClick={() => handleItemClick(category.id, item.id)}
                                    isChild={!!item.parentId}
                                    parentIcon={getCategoryIcon(item.category)}
                                  />
                                ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                    
                    <div className="mb-8">
                      {categories
                        .filter(category => category.id === 'api')
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <FaCode className="text-red-500 mr-2" />
                                <h3 className="font-medium text-red-500">{category.name}</h3>
                              </div>
                              <CategoryPinButton 
                                category={category} 
                                isPinned={isPinned} 
                                handlePinToggle={handleCategoryPinToggle} 
                              />
                            </div>
                            
                            <ul className="space-y-3">
                              {allMenuItems
                                .filter(item => item.category === category.id)
                                .map(item => (
                                  <MenuItem 
                                    key={item.id} 
                                    item={item} 
                                    isPinned={isPinned(item.id)}
                                    onPinToggle={() => handlePinToggle(item.id)}
                                    onClick={() => handleItemClick(category.id, item.id)}
                                    isChild={!!item.parentId}
                                    parentIcon={getCategoryIcon(item.category)}
                                  />
                                ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                    
                    <div className="mb-8">
                      {categories
                        .filter(category => category.id === 'database')
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <FaDatabase className="text-red-500 mr-2" />
                                <h3 className="font-medium text-red-500">{category.name}</h3>
                              </div>
                              <CategoryPinButton 
                                category={category} 
                                isPinned={isPinned} 
                                handlePinToggle={handleCategoryPinToggle} 
                              />
                            </div>
                            
                            <ul className="space-y-3">
                              {allMenuItems
                                .filter(item => item.category === category.id)
                                .map(item => (
                                  <MenuItem 
                                    key={item.id} 
                                    item={item} 
                                    isPinned={isPinned(item.id)}
                                    onPinToggle={() => handlePinToggle(item.id)}
                                    onClick={() => handleItemClick(category.id, item.id)}
                                    isChild={!!item.parentId}
                                    parentIcon={getCategoryIcon(item.category)}
                                  />
                                ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                    
                    {/* Нижний ряд (IAM, FAR, Plugins & Modules) */}
                    <div className="mb-8">
                      {categories
                        .filter(category => category.id === 'iam')
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <FaUserShield className="text-red-500 mr-2" />
                                <h3 className="font-medium text-red-500">{category.name}</h3>
                              </div>
                              <CategoryPinButton 
                                category={category} 
                                isPinned={isPinned} 
                                handlePinToggle={handleCategoryPinToggle} 
                              />
                            </div>
                            
                            <ul className="space-y-3">
                              {allMenuItems
                                .filter(item => item.category === category.id)
                                .map(item => (
                                  <MenuItem 
                                    key={item.id} 
                                    item={item} 
                                    isPinned={isPinned(item.id)}
                                    onPinToggle={() => handlePinToggle(item.id)}
                                    onClick={() => handleItemClick(category.id, item.id)}
                                    isChild={!!item.parentId}
                                    parentIcon={getCategoryIcon(item.category)}
                                  />
                                ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                    
                    <div className="mb-8">
                      {categories
                        .filter(category => category.id === 'far')
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <FaTasks className="text-red-500 mr-2" />
                                <h3 className="font-medium text-red-500">{category.name}</h3>
                              </div>
                              <CategoryPinButton 
                                category={category} 
                                isPinned={isPinned} 
                                handlePinToggle={handleCategoryPinToggle} 
                              />
                            </div>
                            
                            <ul className="space-y-3">
                              {allMenuItems
                                .filter(item => item.category === category.id)
                                .map(item => (
                                  <MenuItem 
                                    key={item.id} 
                                    item={item} 
                                    isPinned={isPinned(item.id)}
                                    onPinToggle={() => handlePinToggle(item.id)}
                                    onClick={() => handleItemClick(category.id, item.id)}
                                    isChild={!!item.parentId}
                                    parentIcon={getCategoryIcon(item.category)}
                                  />
                                ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                    
                    <div className="mb-8">
                      {categories
                        .filter(category => category.id === 'plugins')
                        .map((category: Category) => (
                          <div key={category.id} className="mb-8">
                            <div className="mb-4 flex items-center justify-between">
                              <div className="flex items-center">
                                <FaPuzzlePiece className="text-red-500 mr-2" />
                                <h3 className="font-medium text-red-500">{category.name}</h3>
                              </div>
                              <CategoryPinButton 
                                category={category} 
                                isPinned={isPinned} 
                                handlePinToggle={handleCategoryPinToggle} 
                              />
                            </div>
                            
                            <ul className="space-y-3">
                              {allMenuItems
                                .filter(item => item.category === category.id)
                                .map(item => (
                                  <MenuItem 
                                    key={item.id} 
                                    item={item} 
                                    isPinned={isPinned(item.id)}
                                    onPinToggle={() => handlePinToggle(item.id)}
                                    onClick={() => handleItemClick(category.id, item.id)}
                                    isChild={!!item.parentId}
                                    parentIcon={getCategoryIcon(item.category)}
                                  />
                                ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
