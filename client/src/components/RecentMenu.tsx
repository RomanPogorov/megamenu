import { useMenu } from '../hooks/useMenu';
import { MenuItem } from '../types/menu';
import { FaThumbtack, FaFolderOpen, FaCode, FaDatabase, FaUser, FaBook, FaTasks, FaPuzzlePiece, FaUserShield } from 'react-icons/fa';

interface RecentMenuProps {
  items: MenuItem[];
}

const RecentMenu: React.FC<RecentMenuProps> = ({ items }) => {
  const { addToPinned, removeFromPinned, pinnedItems, getCategoryIcon } = useMenu();

  const isPinned = (itemId: string) => {
    return pinnedItems.some(item => item.id === itemId);
  };

  const handlePinToggle = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    
    if (isPinned(item.id)) {
      removeFromPinned(item.id);
    } else {
      addToPinned(item);
    }
  };

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case 'folder-open':
        return <FaFolderOpen className="text-gray-500 mr-2" />;
      case 'code':
        return <FaCode className="text-gray-500 mr-2" />;
      case 'database':
        return <FaDatabase className="text-gray-500 mr-2" />;
      case 'user':
      case 'user-injured':
        return <FaUser className="text-gray-500 mr-2" />;
      case 'book':
        return <FaBook className="text-gray-500 mr-2" />;
      case 'tasks':
        return <FaTasks className="text-gray-500 mr-2" />;
      case 'puzzle-piece':
        return <FaPuzzlePiece className="text-gray-500 mr-2" />;
      case 'user-shield':
        return <FaUserShield className="text-gray-500 mr-2" />;
      default:
        return <i className={`fas fa-${icon} text-gray-500 mr-2`}></i>;
    }
  };

  return (
    <div 
      id="recentDropdown" 
      className="absolute left-full ml-2 bottom-0 bg-white shadow-lg rounded-lg w-56 border border-gray-200 z-20"
    >
      <div className="p-2 border-b border-gray-200 font-medium text-gray-800">RECENT</div>
      <div className="max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">No recent items</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50">
              <div className="flex items-center">
                {item.parentId ? (
                  <div className="relative">
                    {getIconComponent(getCategoryIcon(item.category))}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-none absolute inline-flex h-full w-full rounded-full bg-blue-500"></span>
                    </span>
                  </div>
                ) : (
                  getIconComponent(item.icon)
                )}
                <span className="text-sm text-gray-800 truncate max-w-[150px]">{item.name}</span>
              </div>
              <button
                className={`${isPinned(item.id) ? 'text-red-500 hover:text-gray-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                aria-label={isPinned(item.id) ? `Unpin ${item.name}` : `Pin ${item.name}`}
                onClick={(e) => handlePinToggle(e, item)}
              >
                <FaThumbtack className="text-sm" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentMenu;
