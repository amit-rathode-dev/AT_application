import { ChangeDetectorRef, Component, EventEmitter, input, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommontableComponent, TableAction, TableColumn } from '../../shared/commontable/commontable.component';
import { MessageService } from 'primeng/api';

import { FormArray, ReactiveFormsModule } from '@angular/forms';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { Subject, takeUntil } from 'rxjs';



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
  imports: [CommonModule, DropdownModule, TableModule, CheckboxModule,
    MultiSelectModule
    , NoDataPipe, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule],
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
  roles: any[] = [];
  designationsarray: any[] = [];
  organizationsarray: any[] = [];
  departmentsarray: any[] = [];
  incominDepartmentData: any[] = [];
  destroy$ = new Subject<void>();
  departments: any[] = [
    { id: 2, name: 'QA' },
    { id: 3, name: 'IT' },
    { id: 1, name: 'Production' },
    { id: 4, name: 'Sales' }
  ]


  Math = Math;
  selectedOrg: any;
  newUserFormVisible: boolean = false;

  selectedOrganizations: any[] = [];
  selectedOrganizationsarray: any[] = [];



  setupConditionalValidators() {
    this.registerForm.get('isMultipleOrg')?.valueChanges.subscribe(isMultiple => {
      const orgControl = this.registerForm.get('org_id');
      const multipleOrgControl = this.registerForm.get('multiple_org_ids');
      const departmentControl = this.registerForm.get('department_id');

      if (isMultiple) {
        // Multiple org mode
        orgControl?.clearValidators();
        departmentControl?.clearValidators();
        multipleOrgControl?.setValidators([Validators.required]);
      } else {
        // Single org mode
        multipleOrgControl?.clearValidators();
        orgControl?.setValidators([Validators.required]);
        departmentControl?.setValidators([Validators.required]);

        // Clear multiple org selections
        multipleOrgControl?.setValue([]);
        this.selectedOrganizations = [];
        this.removeDynamicDepartmentControls();
      }

      orgControl?.updateValueAndValidity();
      multipleOrgControl?.updateValueAndValidity();
      departmentControl?.updateValueAndValidity();
    });
  }

  multiselectDropdown: boolean = false
  onMultipleOrgToggle(event: any) {
    if (!event.checked) {
      this.registerForm.get('multiple_org_ids')?.reset();
      this.selectedOrganizationsarray = [];
      this.multiselectDropdown = true;
    } else {
      this.registerForm.get('org_id')?.reset();
    }
  }

  onOrganizationChangee(orgId: any) {
    // Handle single organization selection
    this.registerForm.patchValue({ department_id: '' });
  }

  onMultipleOrganizationChange(selectedIds: any[]) {

    this.selectedOrganizationsarray = this.organizationsarray.filter(org => selectedIds.includes(org.id));

    console.log('Selected Organizations:]]]]', this.selectedOrganizationsarray);
    
    // selectedIds.forEach(id => {
    //   if (!this.registerForm.contains(`department_${id}`)) {
    //     this.registerForm.addControl(`department_${id}`, this.fb.control(''));
    //   }
    // });

    
  // clear old FormArray
  this.orgDepartments.clear();

  // create new FormArray entries
  this.selectedOrganizationsarray.forEach(org => {
    this.orgDepartments.push(
      this.fb.group({
        org_id: [org.id],
        department_id: ["", Validators.required]
      })
    );
  });
  }
  removeDynamicDepartmentControls() {
    // Remove all dynamic department controls
    Object.keys(this.registerForm.controls).forEach(key => {
      if (key.startsWith('department_')) {
        this.registerForm.removeControl(key);
      }
    });
  }

  constructor(private messageService: MessageService, private fb: FormBuilder, private commonService: CommonService, private modalHandler: ModealHandlerService, private cd: ChangeDetectorRef) { }

  ngOnInit() {


    this.initForm();


    this.getUserData();
    this.getTitle();
    this.getOrgData();
    this.getRoleData();
    this.getDepartmentData();
    this.setPasswordValidator();

  }

    get orgDepartments(): FormArray {
    return this.registerForm.get('orgDepartments') as FormArray;
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
      user_name: ["", Validators.required],
      first_name: ["", Validators.required],
      last_name: [""],
      phone_number: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      isMultipleOrg: [false],
      org_id: [""],
      multiple_org_ids: [""],
      department_id: [""],
      designation_id: [""],
      reporting_id: [""],
      password: [''],

      
       orgDepartments: this.fb.array([])
    })

    this.setupConditionalValidators();
  }



  productCategories = [{ name: 'Category 1', value: 'cat1' }, { name: 'Category 2', value: 'cat2' }];
  ratings = [{ name: '5 Stars', value: 5 }, { name: '4 Stars', value: 4 }];
  quantities = [{ name: '1 Unit', value: 1 }, { name: '2 Units', value: 2 }];



  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  createNewUser() {
    // this.visible = true;
    this.newUserFormVisible = true;

  }


  getOrgData() {

    this.commonService.getAllData('api/user/getAllOrg').subscribe(
      {
        next: (res: any) => {

          if (res.status == 200) {

            this.organizationsarray = res.data
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

  getRoleData() {
    this.commonService.getAllData('api/user/getAllRole')
      .subscribe({
        next: (res: any) => {

          if (res.status == 200) {
            // this.roles = res.data
            this.designationsarray = res.data;

          } else {
            console.log('error');
          }
        },
        error: (err) => {
          console.log('error ', err);
        }
      });
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
    this.newUserFormVisible = false
    this.registerForm.reset()
  }

  submitForm() {
    // if (!this.isEditing) {
    this.addUser()
    // } else {
    //   this.updateUser()
    // }

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

      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;

    let orgArray: any[] = [];
    if (formValue.isMultipleOrg) {
      orgArray = formValue.multiple_org_ids.map((orgId: number) => ({
        org_id: orgId,
        department_id: formValue[`department_${orgId}`] || null,
      }));
    } else {
      orgArray = [
        {
          org_id: formValue.org_id,         // corrected from formValue.id
          department_id: formValue.department_id,
        },
      ];
    }

    const payload = {
      user_name: formValue.user_name,
      title_id: formValue.title_id,
      password: formValue.password,
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      email: formValue.email,
      phone_number: formValue.phone_number,
      org: orgArray,
      role_id: formValue.designation_id,
      // middle_name: formValue.middle_name ?? "",
      department: formValue.department ?? "",
      reporting_id: formValue.reporting_id || null,
    };

    console.log("Final Payload ===>", payload);

    this.commonService.createData("api/user/createUser", payload).subscribe({
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

    let org_id: number = this.registerForm.get('org_id')?.value || 0;
    let department_id: number = 0;
    let user_role_id: number = Number(this.registerForm.get('designation_id')?.value) || 0;

    let orgPayload: any[] = [];

    if (this.registerForm.get('isMultipleOrg')?.value) {
      const orgDepartmentsArr = this.orgDepartments;
      if (orgDepartmentsArr && orgDepartmentsArr.length > 0) {
      orgDepartmentsArr.controls.forEach((group: any) => {
        orgPayload.push({
        org_id: group.get('org_id')?.value,
        department_id: group.get('department_id')?.value,
        user_role_id: user_role_id
        });
      });
      }
    } else {
      org_id = this.registerForm.get('org_id')?.value || 0;
      department_id = this.registerForm.get('department_id')?.value || 0;
      orgPayload.push({
      org_id: org_id,
      department_id: department_id,
      user_role_id: user_role_id
      });
    }


    this.commonService.postDataWithBody('api/user/getUserForReportingTo', { org: orgPayload }).subscribe({
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




  titlesarray = [{ id: 1, name: 'Mr' }, { id: 2, name: 'Ms' }];

  // departmentsarray = [{ department_id: 1, department_name: 'Dept 1' }, { department_id: 2, department_name: 'Dept 2' }];

  reportingManagers = [{ id: 1, name: 'Manager 1' }, { id: 2, name: 'Manager 2' }];





  // removeOrganization(index: number): void {
  //   const org = this.selectedOrganizationsarray[index];

  //   // 1. Remove org from the array (so it disappears from the UI)
  //   this.selectedOrganizationsarray.splice(index, 1);

  //   // 2. Remove or reset the corresponding FormControl
  //   const controlName = 'department_' + org.id;
  //   if (this.registerForm.contains(controlName)) {
  //     this.registerForm.removeControl(controlName); // or .reset(null) if you want to keep it
  //   }
  // }

  removeOrganization(index: number): void {
    const org = this.selectedOrganizationsarray[index];

    // 1. Remove org from the array (used in UI)
    this.selectedOrganizationsarray.splice(index, 1);

    // 2. Remove department form control
    const controlName = 'department_' + org.id;
    if (this.registerForm.contains(controlName)) {
      this.registerForm.removeControl(controlName);
    }

    // 3. Update the multiple_org_ids formControl to remove the org ID
    const currentSelected = this.registerForm.get('multiple_org_ids')?.value || [];
    const updatedSelected = currentSelected.filter((id: number) => id !== org.id);
    this.registerForm.get('multiple_org_ids')?.setValue(updatedSelected);

    // 4. Trigger logic to re-sync dropdown display
    // this.onMultipleOrganizationChange(updatedSelected);
  }

  getSelectedOrgName(): string {
    const orgId = this.registerForm.get('org_id')?.value;
    const selectedOrg = this.organizationsarray.find(org => org.id === orgId);
    return selectedOrg ? selectedOrg.name : '';
  }


  getDepartmentData(selectedOrganizations: any[] = []) {
    //  const org: any[] = [];
    //  org.push(...selectedOrganizations.map(org => org.id));

    // const orgIds: number[] = selectedOrganizations.map(org => org.id);

    const payload = { org: [] };
    this.commonService.postDataWithBody('api/user/getDepartmentByOrgForUserApi', payload)

      .subscribe({
        next: (res: any) => {

          if (res.status == 200) {
            // Assuming res.data is your response array
            this.incominDepartmentData = [];
            (res.data || []).forEach((org: any) => {
              (org.department || []).forEach((dept: any) => {
                this.departmentsarray.push({
                  id: dept.id,
                  department_name: dept.name,
                  org_id: org.org_id,
                  org_name: org.org_name
                });
              });
            });
            console.log(this.departmentsarray, 'here departments array');


          } else {
            console.log('error');
          }

        },
        error: (err) => {
          this.modalHandler.showError(
            err.error.message ? err.error.message : 'Something went wrong!'
          );
        }
      });
  }


  multipleOrgClosed() {
    console.log('multipleOrgClosed called');
    const selectedIds = this.registerForm.get('multiple_org_ids')?.value || [];
    this.selectedOrganizationsarray = this.organizationsarray.filter(org => selectedIds.includes(org.id));
    // this.getDepartmentData();

    this.cd.detectChanges();
  }


  handleMultipleOrgChange(selectedOrgs: any[]) {
  this.onMultipleOrganizationChange(selectedOrgs);
  this.multipleOrgClosed();   
  // this.multipleOrgFormControlsCreated(selectedOrgs);
}

  multipleOrgFormControlsCreated(selectedOrgs: any[]) {
    this.selectedOrganizationsarray = selectedOrgs;

    console.log('Selected Organizations:', this.selectedOrganizationsarray);
    
    // clear old array
    this.orgDepartments.clear();

    selectedOrgs.forEach(org => {
      this.orgDepartments.push(
        this.fb.group({
          org_id: [org.id],
          department_id: ["", Validators.required]
        })
      );
    });
  }






}