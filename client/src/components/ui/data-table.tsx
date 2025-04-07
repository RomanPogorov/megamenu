import React from 'react';

interface Column {
  id: string;
  header: string;
  width: string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  renderCell: (row: T, columnId: string) => React.ReactNode;
}

function DataTable<T>({ columns, data, renderCell }: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-gray-200 text-sm font-medium text-gray-500">
        {columns.map((column) => (
          <div 
            key={column.id} 
            className={`col-span-${column.width} ${column.align ? `text-${column.align}` : ''}`}
          >
            {column.header}
          </div>
        ))}
      </div>
      
      {/* Table body */}
      {data.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No data available
        </div>
      ) : (
        data.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-gray-200 hover:bg-gray-50 text-sm"
          >
            {columns.map((column) => (
              <div 
                key={`${rowIndex}-${column.id}`} 
                className={`col-span-${column.width} ${column.align ? `text-${column.align}` : ''} ${column.id === 'category' || column.id === 'typeName' ? 'truncate' : ''}`}
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
