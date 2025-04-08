import FilterTabs from "./ui/filter-tabs";
import { useState, useMemo } from "react";
import {
  FaSearch,
  FaPlus,
  FaTable,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { ResourceType } from "../types/resources";
import { resourceTypes } from "../data/resourceTypesData";
import DataTable, { Column } from "./ui/data-table";

interface SortableColumn extends Column {
  isSortable?: boolean;
}

const ResourcesTable = () => {
  const [activeTab, setActiveTab] = useState("Categorised");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>("typeName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const tabs = [
    "Categorised",
    "Custom",
    "Populated",
    "System",
    "Failed validation",
  ];

  const filteredResources = useMemo(
    () =>
      resourceTypes.filter(
        (resource) =>
          resource.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || !column.isSortable) {
      return;
    }

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const sortedResources = useMemo(() => {
    if (!sortColumn) {
      return filteredResources;
    }

    return [...filteredResources].sort((a, b) => {
      const aValue = a[sortColumn as keyof ResourceType];
      const bValue = b[sortColumn as keyof ResourceType];

      const valA = aValue === undefined || aValue === null ? "" : aValue;
      const valB = bValue === undefined || bValue === null ? "" : bValue;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      } else if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        const strA = String(valA);
        const strB = String(valB);
        return sortDirection === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      }
    });
  }, [filteredResources, sortColumn, sortDirection]);

  const columns: SortableColumn[] = [
    { id: "typeName", header: "Type name", width: "2", isSortable: true },
    { id: "category", header: "Category", width: "1", isSortable: true },
    { id: "description", header: "Description", width: "6", isSortable: false },
    { id: "version", header: "Version", width: "0.5", isSortable: true },
    {
      id: "instancesCount",
      header: "Instances",
      width: "0.75",
      isSortable: true,
    },
    { id: "size", header: "Size (GB)", width: "0.5", isSortable: true },
    {
      id: "lastUpdated",
      header: "Last updated",
      width: "0.75",
      isSortable: true,
    },
    { id: "status", header: "Status", width: "1", isSortable: true },
    {
      id: "actions",
      header: "Actions",
      width: "1",
      align: "left" as const,
      isSortable: false,
    },
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
          data={sortedResources}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
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
