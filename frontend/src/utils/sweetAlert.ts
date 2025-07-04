import Swal from 'sweetalert2';

// Custom SweetAlert configurations
export const swalConfig = {
  // Confirmation dialog for delete actions
  deleteConfirm: (itemName: string = 'item') => ({
    title: 'Are you sure?',
    text: `You won't be able to revert this ${itemName}!`,
    icon: 'warning' as const,
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    allowOutsideClick: false,
    allowEscapeKey: true,
    focusCancel: true
  }),

  // Success message
  success: (message: string = 'Operation completed successfully!') => ({
    title: 'Success!',
    text: message,
    icon: 'success' as const,
    timer: 3000,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    allowOutsideClick: true,
    allowEscapeKey: true
  }),

  // Error message
  error: (message: string = 'Something went wrong!') => ({
    title: 'Error!',
    text: message,
    icon: 'error' as const,
    confirmButtonColor: '#d33'
  }),

  // Loading message
  loading: (message: string = 'Processing...') => ({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  }),

  // Confirmation for other actions
  confirm: (title: string, text: string) => ({
    title,
    text,
    icon: 'question' as const,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  })
};

// Helper functions
export const showDeleteConfirm = async (itemName: string = 'item'): Promise<boolean> => {
  const result = await Swal.fire(swalConfig.deleteConfirm(itemName));
  return result.isConfirmed;
};

export const showSuccess = async (message: string = 'Operation completed successfully!') => {
  return await Swal.fire(swalConfig.success(message));
};

export const showError = (message: string = 'Something went wrong!') => {
  Swal.fire(swalConfig.error(message));
};

export const showLoading = (message: string = 'Processing...') => {
  Swal.fire(swalConfig.loading(message));
};

export const hideLoading = () => {
  Swal.close();
};

export const showConfirm = async (title: string, text: string): Promise<boolean> => {
  const result = await Swal.fire(swalConfig.confirm(title, text));
  return result.isConfirmed;
};

// Toast notifications for quick feedback
export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: type,
    title: message
  });
};
