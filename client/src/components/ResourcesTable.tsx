import FilterTabs from "./ui/filter-tabs";
import { useState } from "react";
import { FaSearch, FaPlus, FaTable, FaSortDown } from "react-icons/fa";
import { ResourceType } from "../types/resources";
import { resourceTypes } from "../data/resourceTypesData";
import DataTable from "./ui/data-table";

const ResourcesTable = () => {
  const [activeTab, setActiveTab] = useState("Categorised");
  const [searchTerm, setSearchTerm] = useState("");
  
  const tabs = [
    "Categorised",
    "Custom",
    "Populated",
    "System",
    "Failed validation"
  ];

  const filteredResources = resourceTypes.filter(resource => 
    resource.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: 'category', header: 'Category', width: '2' },
    { id: 'typeName', header: 'Type name', width: '2' },
    { id: 'instancesCount', header: 'Instances count', width: '2' },
    { id: 'size', header: 'Size (GB)', width: '1' },
    { id: 'table', header: 'Table', width: '1' },
    { id: 'lastUpdated', header: 'Last updated', width: '1' },
    { id: 'status', header: 'Status', width: '1' },
    { id: 'actions', header: 'Actions', width: '2', align: 'right' },
  ];

  return (
    <div className="container mx-auto px-6 py-4 h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Resource Types</h1>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors">
          <FaPlus className="inline mr-2" />Resource Type
        </button>
      </div>
      
      {/* Tab navigation */}
      <FilterTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {/* Search input */}
      <div className="mb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder={`Search ${activeTab} types`} 
            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
        </div>
      </div>
      
      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredResources}
        renderCell={(row: ResourceType, columnId: string) => {
          switch (columnId) {
            case 'table':
              return <FaTable className="text-gray-500" />;
            case 'status':
              return (
                <span className={`px-2 py-1 ${
                  row.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                } rounded-full text-xs`}>
                  {row.status}
                </span>
              );
            case 'actions':
              return (
                <div className="text-right">
                  <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs mr-1">
                    ACTION 1
                  </button>
                  <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                    ACTION 2
                  </button>
                </div>
              );
            default:
              return row[columnId as keyof ResourceType];
          }
        }}
      />
    </div>
  );
};

export default ResourcesTable;
