import { 
  FaFolderOpen, 
  FaUserInjured, 
  FaClipboardList, 
  FaPlusCircle, 
  FaDatabase, 
  FaCode, 
  FaBook, 
  FaTasks, 
  FaPuzzlePiece, 
  FaUserShield,
  FaNotesMedical,
  FaPrescription,
  FaHeartbeat,
  FaFileMedicalAlt,
  FaAllergies,
  FaClipboardCheck,
  FaCalendarCheck, 
  FaSyringe,
  FaBullseye,
  FaConciergeBell,
  FaExchangeAlt,
  FaBox,
  FaBookOpen,
  FaUsers,
  FaProjectDiagram,
  FaLayerGroup,
  FaRunning,
  FaTable,
  FaEye,
  FaSortAlphaDown,
  FaThLarge,
  FaMobileAlt,
  FaLock,
  FaIdCard,
  FaKey,
  FaCubes,
  FaSearch,
  FaWpforms,
  FaCircle
} from "react-icons/fa";
import { MenuItem } from "../types/menu";
import { useMenu } from "../hooks/useMenu";

// Map of icon strings to React components for rendering
const ICON_MAP: Record<string, JSX.Element> = {
  'folder-open': <FaFolderOpen />,
  'user-injured': <FaUserInjured />,
  'notes-medical': <FaNotesMedical />,
  'prescription': <FaPrescription />,
  'clipboard-list': <FaClipboardList />,
  'heartbeat': <FaHeartbeat />,
  'file-medical-alt': <FaFileMedicalAlt />,
  'allergies': <FaAllergies />,
  'clipboard-check': <FaClipboardCheck />,
  'calendar-check': <FaCalendarCheck />,
  'syringe': <FaSyringe />,
  'bullseye': <FaBullseye />,
  'concierge-bell': <FaConciergeBell />,
  'exchange-alt': <FaExchangeAlt />,
  'box': <FaBox />,
  'plus-circle': <FaPlusCircle />,
  'code': <FaCode />,
  'users': <FaUsers />,
  'book-open': <FaBookOpen />,
  'database': <FaDatabase />,
  'project-diagram': <FaProjectDiagram />,
  'layer-group': <FaLayerGroup />,
  'running': <FaRunning />,
  'table': <FaTable />,
  'eye': <FaEye />,
  'sort-alpha-down': <FaSortAlphaDown />,
  'th-large': <FaThLarge />,
  'mobile-alt': <FaMobileAlt />,
  'lock': <FaLock />,
  'id-card': <FaIdCard />,
  'key': <FaKey />,
  'cubes': <FaCubes />,
  'search': <FaSearch />,
  'wpforms': <FaWpforms />,
  'book': <FaBook />,
  'tasks': <FaTasks />,
  'puzzle-piece': <FaPuzzlePiece />,
  'user-shield': <FaUserShield />
};

interface SidebarMenuItemProps {
  item: MenuItem;
  onClick: () => void;
  getCategoryIcon: (categoryId: string) => string;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  item, 
  onClick,
  getCategoryIcon
}) => {
  // Access the getParentIcon function from the menu context
  const { getParentIcon } = useMenu();
  
  const renderIcon = (iconName: string) => {
    return ICON_MAP[iconName] || <FaCircle />;
  };

  return (
    <button
      className="p-3 rounded-lg text-red-500 hover:bg-gray-100 transition-colors"
      aria-label={item.name}
      title={item.name}
      onClick={onClick}
    >
      <div className="text-xl relative">
        {item.parentId ? (
          <div className="relative">
            {renderIcon(getParentIcon(item))}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-none absolute inline-flex h-full w-full rounded-full bg-blue-500"></span>
            </span>
          </div>
        ) : (
          renderIcon(item.icon)
        )}
      </div>
    </button>
  );
};

export default SidebarMenuItem;