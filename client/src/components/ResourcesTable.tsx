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
    "Failed validation",
  ];

  const filteredResources = resourceTypes.filter(
    (resource) =>
      resource.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: "typeName", header: "Type name", width: "2" },
    { id: "category", header: "Category", width: "1" },
    { id: "description", header: "Description", width: "6" },
    { id: "version", header: "Version", width: "0.5" },
    { id: "instancesCount", header: "Instances", width: "0.75" },
    { id: "size", header: "Size (GB)", width: "0.5" },
    { id: "lastUpdated", header: "Last updated", width: "0.75" },
    { id: "status", header: "Status", width: "1" },
    { id: "actions", header: "Actions", width: "1", align: "left" as const },
  ];

  return (
    <div className="container mx-auto py-4 h-full">
      <div className="flex items-center justify-between mb-6 px-6">
        <h1 className="text-xl font-semibold text-gray-800">Resource Types</h1>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 hover:bg-gray-50 transition-colors">
          <FaPlus className="inline mr-2" />
          Resource Type
        </button>
      </div>

      {/* Tab navigation */}
      <div className="px-6">
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Search input */}
      <div className="mb-4 px-6">
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
      <div className="px-6">
        <DataTable
          columns={columns}
          data={filteredResources}
          renderCell={(row: ResourceType, columnId: string) => {
            switch (columnId) {
              case "table":
                return <FaTable className="text-gray-500" />;
              case "status":
                return (
                  <span
                    className={`px-2 py-1 ${
                      row.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    } rounded-full text-xs`}
                  >
                    {row.status}
                  </span>
                );
              case "actions":
                return (
                  <div className="flex gap-3">
                    <button className="inline-flex px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs whitespace-nowrap">
                      View
                    </button>
                    <button className="inline-flex px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs whitespace-nowrap">
                      Edit
                    </button>
                  </div>
                );
              default:
                return row[columnId as keyof ResourceType];
            }
          }}
        />
      </div>
    </div>
  );
};

export default ResourcesTable;
