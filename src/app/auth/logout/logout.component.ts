import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../components/shared/services/modeal-handler.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(private router: Router, private modalHandler: ModealHandlerService,private location: Location) { }


  ngOnInit(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      }
    }).then(result => {
      if (result.isConfirmed) {

        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        localStorage.removeItem('org_name');
        localStorage.removeItem('role_name');
        localStorage.removeItem('userDetails');
        localStorage.removeItem('org_id');
        localStorage.removeItem('user_role_id');
    
        // Swal.fire({
        //   title: 'Success!',
        //   text: 'Loged out successfully.',
        //   icon: 'success',
        //   confirmButtonColor: '#008080',
        //   timer: 2000,
        //   timerProgressBar: true
        // });


            this.modalHandler.showToast('Logged Out Successfully');

        this.router.navigate(['/auth']);
      } else {

        // this.router.navigate(['/home']);
         this.location.back(); 
      }
    });
  }
}
