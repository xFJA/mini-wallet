import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: ((item: T, index: number, data: T[]) => ReactNode) | string;
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
      <div className="border border-dashed border-muted/30 glass-card rounded-md p-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-muted-foreground/50"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-lg bg-muted/30 backdrop-blur-sm border border-muted/20 shadow-lg ${className}`}
    >
      <table className="min-w-full divide-y divide-muted/20">
        <thead className="bg-muted/40">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/20">
          {data.map((item) => {
            const rowClass = typeof rowClassName === 'function' ? rowClassName(item) : rowClassName;

            return (
              <tr
                key={keyExtractor(item)}
                className={`transition-colors duration-200 hover:bg-muted/40 ${rowClass}`}
              >
                {columns.map((column, columnIndex) => {
                  const cellContent =
                    typeof column.accessor === 'function'
                      ? column.accessor(item, data.indexOf(item), data)
                      : String(item[column.accessor as keyof T]);

                  return (
                    <td
                      key={columnIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${column.className || 'text-white/90'}`}
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
