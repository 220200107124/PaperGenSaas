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
                    ...initialFilters,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setData(response.data.data);
                setPagination(response.data.pagination);
                setError(null);
            } else {
                setError(response.data.message || 'Failed to fetch data');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'An error occurred while fetching data';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [url, page, limit, search, initialSortBy, initialOrder]);

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
        pagination,
        refresh: fetchData,
        setData, // For local updates (delete/edit)
    };
}
