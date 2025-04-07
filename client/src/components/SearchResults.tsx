import { useMenu } from "../hooks/useMenu";
import { MenuItem } from "../types/menu";
import { Icon } from "./Icon";
import {
  ICON_RESOURCES,
  ICON_DATABASE,
  ICON_API,
  ICON_NOTEBOOKS,
  ICON_FAR,
  ICON_PLUGINS,
  ICON_IAM,
  ICON_LAYER_GROUP,
} from "../assets/icons";

interface SearchResultsProps {
  results: MenuItem[];
  resultsByCategory: Record<string, MenuItem[]>;
  filterOptions: {
    id: string;
    name: string;
    count: number;
  }[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onItemClick: (categoryId: string, itemId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  resultsByCategory,
  filterOptions,
  activeFilter,
  setActiveFilter,
  onItemClick,
}) => {
  const { getCategoryIcon: getIconName } = useMenu();

  const renderCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "resources":
        return <Icon name={ICON_RESOURCES} className="mr-1" />;
      case "database":
        return <Icon name={ICON_DATABASE} className="mr-1" />;
      case "api":
        return <Icon name={ICON_API} className="mr-1" />;
      case "notebooks":
        return <Icon name={ICON_NOTEBOOKS} className="mr-1" />;
      case "far":
        return <Icon name={ICON_FAR} className="mr-1" />;
      case "plugins":
        return <Icon name={ICON_PLUGINS} className="mr-1" />;
      case "iam":
        return <Icon name={ICON_IAM} className="mr-1" />;
      default:
        return <Icon name={ICON_LAYER_GROUP} className="mr-1" />;
    }
  };

  // Get the filtered results based on active filter
  const getFilteredResults = () => {
    if (activeFilter === "all") {
      return results;
    }
    return resultsByCategory[activeFilter] || [];
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="px-16 pb-8 max-w-4xl mx-auto">
      {/* Category Filters */}
      <div className="flex items-center mb-6 space-x-3 flex-wrap">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            className={`px-4 py-1 rounded-full text-sm flex items-center mb-2 ${
              activeFilter === filter.id
                ? "bg-red-500 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            } transition-colors`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.name}{" "}
            <span
              className={`ml-1 ${
                activeFilter === filter.id
                  ? "bg-white text-red-500"
                  : "bg-gray-100 text-gray-800"
              } rounded-full w-5 h-5 inline-flex items-center justify-center text-xs`}
            >
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Results */}
      {filteredResults.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          Результаты не найдены. Попробуйте другие поисковые запросы или
          фильтры.
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          {filteredResults.map((item, index) => (
            <div
              key={item.id}
              className="py-4 px-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
              onClick={() => onItemClick(item.category, item.id)}
            >
              <div className="flex items-center pl-2">
                <span className="font-medium text-gray-800">{item.name}</span>
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                {renderCategoryIcon(item.category)}
                {item.categoryName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
