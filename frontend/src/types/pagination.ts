export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  loading: boolean;
}

const paginationExports = {
  PaginationParams: {} as PaginationParams,
  PaginationInfo: {} as PaginationInfo,
  PaginatedResponse: {} as PaginatedResponse<any>,
  PaginationState: {} as PaginationState,
};

export default paginationExports;
