interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const successResponse = <T>(data: T, message: string = "Success"): ApiResponse<T> => ({
  success: true,
  message,
  data
});

export const errorResponse = (message: string, error?: string): ApiResponse => ({
  success: false,
  message,
  error
});
