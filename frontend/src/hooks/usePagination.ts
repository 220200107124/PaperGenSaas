import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface PaginationData {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
}

interface UsePaginationOptions {
    url: string;
    initialLimit?: number;
    initialSortBy?: string;
    initialOrder?: 'ASC' | 'DESC';
    initialFilters?: Record<string, any>;
}

export function usePagination<T>({
    url,
    initialLimit = 10,
    initialSortBy = 'createdAt',
    initialOrder = 'DESC',
    initialFilters = {},
}: UsePaginationOptions) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
    const [pagination, setPagination] = useState<PaginationData | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(url, {
                params: {
                    page,
                    limit,
                    search,
                    sortBy: initialSortBy,
                    order: initialOrder,
                    ...filters,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Handle both structure: { success, data, pagination } and { data, pagination }
            const responseData = response.data.data !== undefined ? response.data.data : response.data;
            const paginationData = response.data.pagination;
            const normalizedData = Array.isArray(responseData) ? responseData : [];

            setData(normalizedData);
            setPagination(paginationData);
            setError(null);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'An error occurred while fetching data';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [url, page, limit, search, initialSortBy, initialOrder, filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        page,
        setPage,
        limit,
        setLimit,
        search,
        setSearch,
        filters,
        setFilters,
        pagination,
        refresh: fetchData,
        setData, // For local updates (delete/edit)
    };
}
