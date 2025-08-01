import { Component, EventEmitter, input, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommontableComponent, TableAction, TableColumn } from '../../shared/commontable/commontable.component';
import { MessageService } from 'primeng/api';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgComponentOutlet } from "@angular/common"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ReusablemodulesComponent } from '../../shared/reusablemodules/reusablemodules.component';
import { PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';
import { Password } from 'primeng/password';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import Swal from 'sweetalert2';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';


interface User {
  user_id: any;
  title_name: string;
  org_name: string;
  email: string;
  user_role_id: string;
  role_id: string;
  reporting_id: string;
  org_id: string;
  phone_number: string;
  last_name: string;
  user_name: string;
  title_id: string;
  first_name: string;
  id: number;
  name: string;
  zoneId: string;
  role: string;
  department: string;
  designation: string;
  software_type: string;
}

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [CommonModule, DropdownModule, TableModule,NoDataPipe, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule],
  providers: [MessageService],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.css'
})
export class UserRolesComponent implements OnInit {

  @ViewChild('dt') table!: Table;
  registerForm!: FormGroup
  visible: boolean = false;
  isEditing: boolean = false
  creationDate: string = new Date().toLocaleDateString();
  users: User[] = [];
  titles: any = [];
  organizations: any = [];
  designations: any[] = [];
  selectedUsers: User[] = [];
  reportingPersons: any[] = [];

  Math = Math;
  selectedOrg: any;




  constructor(private messageService: MessageService, private fb: FormBuilder, private commonService: CommonService, private modalHandler: ModealHandlerService) { }

  ngOnInit() {



    this.getUserData();
    this.getTitle();
    this.initForm();
    this.getOrgData();
    this.setPasswordValidator();

  }

  setPasswordValidator(): void {
    const passwordControl = this.registerForm.get('password');
    if (!this.isEditing) {
      passwordControl?.setValidators([Validators.required]);
    } else {
      passwordControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      title_id: ["", Validators.required],
      first_name: ["", Validators.required],
      user_name: ["", Validators.required],
      last_name: [""],
      email: ["", [Validators.required, Validators.email]],
      phone_number: ["", Validators.required],
      org_id: ["", Validators.required],
      department: [],
      reporting_id: [''],
      role_id: ["", Validators.required],
      user_id: [""],
      password: ['', Validators.required],
      software_type:['']
    })
  }


  productCategories = [{ name: 'Category 1', value: 'cat1' }, { name: 'Category 2', value: 'cat2' }];
  ratings = [{ name: '5 Stars', value: 5 }, { name: '4 Stars', value: 4 }];
  quantities = [{ name: '1 Unit', value: 1 }, { name: '2 Units', value: 2 }];



  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  createNewUser() {
    this.visible = true;
  }


  getOrgData() {

    this.commonService.getAllData('api/user/getAllOrg').subscribe(
      {
        next: (res: any) => {

          if (res.status == 200) {

            this.organizations = res.data
            console.log('here is the organization data', this.organizations);

          } else {
            console.log('error');
          }

        },
        error: (err) => {
          console.log('error ', err);

        }
      }
    )
  }


  getUserData() {

    console.log('here is the user data______>');

    this.commonService.getAllData('api/user/getAllUserDetails').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.users = res.data
          console.log(this.users, 'userData');

        } else {
          console.log('invalid', res);

        }
      }
    })
  }

  getTitle() {
    this.commonService.getAllData('api/user/getAllTitle').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.titles = res.data
          console.log('here are roles', this.titles);
        } else {

          console.log('Invalid ', res);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }


  editUser(user: User) {

    console.log('here is the user', user);

    console.log('here is consoled data____>', this.titles);

    this.messageService.add({
      severity: 'info',
      summary: 'Edit User',
      detail: `Edit User ${user.name} functionality will be implemented with API integration`
    });

    this.visible = true;
    this.isEditing = true;

    this.registerForm.patchValue({
      title_id: Number(user.title_id) || '',
      first_name: user?.first_name || '',
      user_name: user?.user_name || '',
      last_name: user?.last_name || '',
      software_type: user?.software_type || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      org_id: Number(user.org_id) || '',
      // org_id: user.org_id || '',
      department: user?.department || '',
      reporting_id: user?.reporting_id || '',
      role_id: user?.user_role_id || '',
      role_name: user.user_role_id,
      user_id: user?.user_id || '',


    });
    this.onOrganizationChange(Number(user.org_id));

  }


  deleteUser(user: User) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete the User. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteItem(user)

      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire({
          title: 'Cancelled!',
          text: 'Your User is safe.',
          icon: 'success',
          confirmButtonColor: '#008080',
          timer: 1000,
          timerProgressBar: true
        });

      }
    });
  }

  deleteItem(user: User) {


    this.commonService.deleteData('api/user/deleteUser/', user.user_id).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {
          this.visible = false;
          this.getUserData()
          this.modalHandler.showToast(res.message || 'User Deleted successfully', 'success');
        } else {
          this.modalHandler.showError(res.message || 'User Deletion gone Wrong');
          console.log('Invalid ', res);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }

  isSelected(user: User): boolean {
    return this.selectedUsers.some(selectedUser => selectedUser.id === user.id);
  }

  closeDialog() {
    this.visible = false;
    this.registerForm.reset()
  }

  submitForm() {
    if (!this.isEditing) {
      this.addUser()
    } else {
      this.updateUser()
    }

  }

  updateUser() {
    this.commonService.updateData('api/user/updateUser', this.registerForm.value).subscribe({
      next: (res: any) => {

        if (res.status == 200 || res.status == 201) {
          this.visible = false;
          this.modalHandler.showToast(res.message || 'User Updated successfully', 'success');
          console.log('response', res);
          this.getUserData();

        } else {
          this.modalHandler.showError(res.message || 'User Updation gone Wrong');
        }
      },
      error(err) {
        console.log(err);
      },
    }
    )
  }

  addUser() {

    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }


    console.log('here called add user function');
    if (this.registerForm.valid) {
      this.commonService.createData('api/user/createUser', this.registerForm.value).subscribe({
        next: (res: any) => {
          if (res.status == 200 || res.status == 201) {
            this.visible = false
            this.modalHandler.showToast(res.message || 'User Created successfully', 'success');
            console.log('response', res);
            this.getUserData();
          } else {
            this.modalHandler.showError(res.message || 'User Added gone Wrong');
          }
        },
        error(err) {
          console.log(err);
        },
      }
      )
    } else {


      console.log('form is not valid');

    }

  }


  onOrganizationChange(orgId: number) {

    const EXCLUDED_ROLES = ['admin', 'nsm'];

    console.log('org called again');

    const selectedOrg = this.organizations.find((org: any) => org.id === orgId) as { id: number, name: string, data: any[] } | undefined;

    // this.designations = selectedOrg?.data
    //   ? selectedOrg.data.map(d => ({ name: d.role_name, user_role_id: d.user_role_id }))
    //   : [];

    this.designations = selectedOrg?.data
      ? selectedOrg.data
        .filter(d =>
          !EXCLUDED_ROLES.includes(d.role_name.trim().toLowerCase())
        )
        .map(d => ({
          name: d.role_name,
          user_role_id: d.user_role_id
        }))
      : [];

    console.log('Filtered Designations:', this.designations);


    if (this.designations.length === 1) {
      const singleRoleId = this.designations[0].user_role_id;
      this.registerForm.get('role_id')?.setValue(singleRoleId);
    } else {

      this.registerForm.get('role_id')?.setValue('');
    }

  }


  getReportingPerson() {

    const org_id: number = this.registerForm.get('org_id')?.value || 0;
    const user_role_id: number = Number(this.registerForm.get('role_id')?.value) || 0;

    this.commonService.postDataWithBody('api/user/getUserForReportingTo', { org_id, user_role_id }).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.reportingPersons = res.data;
          console.log('Reporting persons', res.data);
        } else {
          this.reportingPersons = [];
          console.log('Error fetching reporting persons', res);
        }
      }
    })
  }


  onRoleChange(event: any) {
    this.getReportingPerson();

  }



}