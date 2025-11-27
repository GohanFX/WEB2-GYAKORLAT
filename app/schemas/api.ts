type PaginatedResult<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
export type { PaginatedResult };