import React from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, RotateCw } from 'lucide-react';
import { clsx } from 'clsx';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data?: T[] | null;
    isLoading?: boolean;
    onSearch?: (query: string) => void;
    onFilterClick?: () => void;
    onRefresh?: () => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        pageSize?: number;
        onPageSizeChange?: (size: number) => void;
        totalRecords?: number;
    };
    emptyState?: React.ReactNode;
}

function DataTable<T extends { id: string | number }>({
    columns,
    data,
    isLoading,
    onSearch,
    onFilterClick,
    onRefresh,
    pagination,
    emptyState,
}: DataTableProps<T>) {
    const safeData = Array.isArray(data) ? data : [];

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/30 overflow-hidden flex flex-col min-h-[400px]">
            {/* Table Header / Actions */}
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-4">
                    {pagination && (
                        <div className="flex items-center gap-4 border-r border-gray-100 pr-4">
                            <div className="text-[10px] font-black text-brand-blue uppercase tracking-widest">
                                {pagination.totalRecords !== undefined ? `${pagination.totalRecords} RECORDS • ` : ''}
                                PAGE {pagination.currentPage} OF {pagination.totalPages}
                            </div>
                            {pagination.onPageSizeChange && (
                                <select
                                    value={pagination.pageSize}
                                    onChange={(e) => pagination.onPageSizeChange?.(Number(e.target.value))}
                                    className="bg-white border border-gray-100 rounded-xl px-3 py-1.5 text-xs font-bold text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/5 transition-all shadow-sm cursor-pointer hover:bg-gray-50"
                                >
                                    {[10, 25, 50, 100].map(size => (
                                        <option key={size} value={size}>{size} per page</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}
                    
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-brand-blue hover:border-brand-blue/20 transition-all shadow-sm"
                        >
                            <RotateCw className={clsx("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                    )}
                    {onFilterClick && (
                        <button
                            onClick={onFilterClick}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto flex-1 w-full relative">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-50/50">
                        <tr>
                            {columns.map((column, idx) => (
                                <th
                                    key={idx}
                                    className={clsx(
                                        "px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50",
                                        column.className
                                    )}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 relative">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((_, idx) => (
                                        <td key={idx} className="px-8 py-6">
                                            <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : safeData.length > 0 ? (
                            safeData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group cursor-default">
                                    {columns.map((column, idx) => (
                                        <td key={idx} className={clsx("px-8 py-6", column.className)}>
                                            {typeof column.accessor === 'function' ? (
                                                column.accessor(item)
                                            ) : (
                                                <span className="text-sm font-bold text-gray-700">
                                                    {String(item[column.accessor])}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-8 py-20 text-center">
                                    {emptyState || (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Search className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-400 font-bold">No results found</p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {pagination && (
                <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-2">
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                        className="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-90 shadow-sm flex items-center justify-center"
                    >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        disabled={pagination.currentPage === pagination.totalPages || pagination.totalPages === 0}
                        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                        className="p-2.5 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-90 shadow-sm flex items-center justify-center"
                    >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default DataTable;

