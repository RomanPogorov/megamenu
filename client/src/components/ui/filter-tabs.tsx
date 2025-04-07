interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 whitespace-nowrap transition-colors ${
            activeTab === tab
              ? 'border-b-2 border-red-500 text-red-500 font-medium'
              : 'text-gray-500 hover:text-gray-800'
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
