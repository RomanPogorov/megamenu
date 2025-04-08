import React from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export interface Column {
  id: string;
  header: string;
  width: string;
  align?: "left" | "right" | "center";
  isSortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  renderCell: (row: T, columnId: string) => React.ReactNode;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (columnId: string) => void;
}

function DataTable<T>({
  columns,
  data,
  renderCell,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  const renderSortIcon = (columnId: string) => {
    if (!columns.find((col) => col.id === columnId)?.isSortable) {
      return null;
    }
    if (sortColumn === columnId) {
      return sortDirection === "asc" ? (
        <FaSortUp className="ml-1 inline text-gray-800" />
      ) : (
        <FaSortDown className="ml-1 inline text-gray-800" />
      );
    }
    return <FaSort className="ml-1 inline text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_1fr_6fr_0.5fr_0.75fr_0.75fr_1.25fr_1fr_1fr] gap-4 py-3 px-4 border-b border-gray-200 text-sm font-medium text-gray-500">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.align ? `text-${column.align}` : ""} truncate${
              column.isSortable ? " cursor-pointer hover:text-gray-700" : ""
            }`}
            onClick={() => column.isSortable && onSort(column.id)}
          >
            {column.header}
            {renderSortIcon(column.id)}
          </div>
        ))}
      </div>

      {/* Table body */}
      {data.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No data available</div>
      ) : (
        data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[2fr_1fr_6fr_0.5fr_0.75fr_0.75fr_1.25fr_1fr_1fr] gap-4 py-3 px-4 border-b border-gray-200 hover:bg-gray-50 text-sm"
          >
            {columns.map((column) => (
              <div
                key={`${rowIndex}-${column.id}`}
                className={`${column.align ? `text-${column.align}` : ""} ${column.id === "description" || column.id === "typeName" ? "truncate" : ""}`}
              >
                {renderCell(row, column.id)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default DataTable;
