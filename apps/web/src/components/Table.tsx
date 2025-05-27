import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: ((item: T) => ReactNode) | string;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((item: T) => string);
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data found',
  className = '',
  rowClassName = '',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex items-center justify-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            const rowClass = typeof rowClassName === 'function' ? rowClassName(item) : rowClassName;

            return (
              <tr key={keyExtractor(item)} className={`hover:bg-gray-50 ${rowClass}`}>
                {columns.map((column, index) => {
                  const cellContent =
                    typeof column.accessor === 'function'
                      ? column.accessor(item)
                      : String(item[column.accessor as keyof T]);

                  return (
                    <td
                      key={index}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || 'text-gray-500'}`}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
