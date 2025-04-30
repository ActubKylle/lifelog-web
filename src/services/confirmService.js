// src/services/confirmService.js
import Swal from 'sweetalert2';

export const confirmAction = {
  delete: (title = 'Delete Item', text = 'Are you sure you want to delete this item? This action cannot be undone.') => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });
  },
  
  archive: (title = 'Archive Item', text = 'Are you sure you want to archive this item?') => {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'Cancel'
    });
  },
  
  custom: (options) => {
    return Swal.fire(options);
  }
};