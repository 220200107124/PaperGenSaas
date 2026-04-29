export interface PaginationResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export function createPaginationResponse<T>(
  data: T[],
  totalRecords: number,
  page: number,
  limit: number,
  message: string = 'Data fetched successfully',
): PaginationResponse<T> {
  const totalPages = Math.ceil(totalRecords / limit);
  return {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
    },
  };
}
