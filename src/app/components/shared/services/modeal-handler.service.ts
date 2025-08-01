import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ModealHandlerService {

  constructor() { }

  showToast(message: string, icon: SweetAlertIcon = 'success') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
  }

 
  // async confirmDialog(
  //   title: string = 'Are you sure?',
  //   text: string = "You won't be able to revert this!",
  //   confirmText: string = 'Yes',
  //   cancelText: string = 'Cancel',
  //   icon: SweetAlertIcon = 'warning'
  // ): Promise<boolean> {
  //   const result: SweetAlertResult = await Swal.fire({
  //     title,
  //     text,
  //     icon,
  //     showCancelButton: true,
  //     confirmButtonColor:  '#dc3545' ,
  //     cancelButtonColor: '#24AFA1A8',
  //     confirmButtonText: confirmText,
  //     cancelButtonText: cancelText
  //   });

  //   return result.isConfirmed;
  // }

  async confirmDialog(
  title: string = 'Are you sure?',
  text: string = "You won't be able to revert this!",
  confirmText: string = 'Delete',        // Default changed here
  cancelText: string = 'Cancel Action',  // Default changed here
  icon: SweetAlertIcon = 'warning'
): Promise<boolean> {
  const result: SweetAlertResult = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#24AFA1A8',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    customClass: {
      confirmButton: 'swal-confirm-btn',
      cancelButton: 'swal-cancel-btn'
    },
  });

  return result.isConfirmed;
}


 
  showError(message: string ) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: toast => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
    
    
  }


  showSuccess(title: string = 'Success!', text: string = 'Operation completed successfully.') {
    Swal.fire({
      icon: 'success',
      title,
      text,
       confirmButtonColor: ' #24AFA1A8 '
    });
  }
}
