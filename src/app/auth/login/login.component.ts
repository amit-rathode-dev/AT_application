import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ModealHandlerService } from '../../components/shared/services/modeal-handler.service';

// import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule, FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  loginForm!: FormGroup;
  orgName: string | null = '';
  roleName: string | null = '';
  showMasterMenu: boolean = false;
  showSuperAdminMenu: boolean = false;
  showMediaMenu: boolean = false;
  showNonadminMenu: boolean = false;
  showContentData: boolean = false;
  organizationId: any;
  roleId: any;
  orgType:any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private modalHandler: ModealHandlerService) { }

  ngOnInit(): void {

    this.orgName = localStorage.getItem('org_name');
    this.orgType =localStorage.getItem('org_type');
    this.organizationId = localStorage.getItem('org_id');
    this.roleName = localStorage.getItem('role_name');
    this.roleId = localStorage.getItem('user_role_id')


    // this.showSuperAdminMenu = this.orgName === 'KOEL' && this.roleName === 'Super Admin';
        this.showSuperAdminMenu = this.orgType === 'Self' && this.roleName === 'Super Admin';

    // this.showMediaMenu = this.roleName !== 'super Admin' && this.orgName !== 'KOEL'; working
    
    // this.showMediaMenu = this.roleName !== 'super Admin' && this.orgType !== 'KOEL';
      this.showMediaMenu = this.roleName !== 'super Admin' && this.orgType !== 'Self';
    // this.showNonadminMenu =
    //   ['asm', 'rsm', 'sales'].includes((this.roleName || '').toLowerCase()) &&
    //   this.orgName === 'KOEL';

    this.showNonadminMenu =
      ['asm', 'rsm', 'sales'].includes((this.roleName || '').toLowerCase()) &&
      this.orgType === 'Self';

    
        // this.showContentData =  this.orgName === 'KOEL' && this.roleName === 'Content Manager';
        this.showContentData =  this.orgType === 'Self' && this.roleName === 'Content Manager';

      console.log(this.showContentData, 'showContentData value' );
      


    this.loginForm = this.fb.group({
      user_name: ['', [Validators.required]],
      password: ['']
    });
  }

  onSubmit(): void {

    console.log("onSubmit function is callled");


    if (this.loginForm.valid) {

      console.log(this.loginForm.value, 'here are the valuessss');


      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          if (res.status == 200) {

            this.modalHandler.showToast(res['message']);
            this.router.navigate(['/dashboard'])
            const user = res.userDetails;

            // const orgName = user?.org_name?.toLowerCase();
                const orgType = user?.org_type?.toLowerCase();
            const roleName = user?.role_name?.toLowerCase();

        //  this.showContentData = orgName === 'KOEL' && roleName === 'Content Manager';

             this.showContentData = orgType === 'Self' && roleName === 'Content Manager';

         console.log(this.showContentData, 'showContentData value' );
      

            if ((orgType === 'self' || orgType === 'Self') && roleName === 'super admin') {
              this.router.navigate(['/dashboard']);
            } else if (
              orgType === 'self' &&
              ['asm','ASM','zsm', 'rsm','sales'].includes(roleName)
            ) {
              this.router.navigate(['/home']);
            }
            if ((orgType !== 'self' && orgType !== 'self') || (roleName === 'Owner' || roleName === 'SR1' || roleName === 'SR2' || roleName === 'Sales')) {
              this.router.navigate(['/partner-Media']);
            } else if ((orgType === 'Self' || orgType ==='self') && roleName === 'content manager') {

              this.router.navigate(['/manager-approval']);
            }
            
         

            // this.modal.showToast(response.message || 'Login successful', 'success');
          } else {
            console.log(res['message'], 'error message');

            this.modalHandler.showError(res.message || 'The username or email you provided are incorrect');
          }


        },
        error: (err) => {
          console.log(err.message, '+++++')
          this.modalHandler.showError(err.message || 'Login Isssue occured');
          console.error('Login failed', err);
        }
      });

    } else {
      console.log('Form is invalid');
    }
  }
  onForgotPassword() {
    console.log('Forgot Password Clicked');
  }
}
