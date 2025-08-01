import { Component, ViewChild } from '@angular/core';
import { ReusablemodulesComponent } from '../../shared/reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../shared/commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonService } from '../../../services/common.service';
import { TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';

interface updatedRoleData {
  id: string
  name: string
}
@Component({
  selector: 'app-org-management',
  standalone: true,
  imports: [CommonModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule],
  templateUrl: './org-management.component.html',
  styleUrl: './org-management.component.css'
})


export class OrgManagementComponent {

  selectedUser: any
  users: any[] = [];
  orgData: any[] = [];
  refinedData: any[] = [];
  tempData: any[] = [];
  tempOrgData:any[] = [];
  rolesData: any[] = [];
  selectedOrg: any[] = [];
  orgTypeData: any[] = []
  updatedRoleData: any[] = []
  zoneData: any[] = [{
    id: 'South', name: 'South'
  }, { id: 'North', name: 'North' },
  { id: 'West', name: 'West' },
{ id: 'East', name: 'East' }];

  orgForm!: FormGroup;
  visible: boolean = false;
  isEditing: boolean = false;
  isEditOrg: boolean = false
  isEditable: boolean = false;
  selectedRoles: any;
  selectedOrgTypes: any;
  addedRoles: { id: number, name: string }[] = [];
  selectedRole: { id: number, name: string } | null = null
  selectedOrgRole: { id: number, name: string } | null = null
  selectedOrgId: any;




  @ViewChild('dt') table!: Table;


  constructor(private fb: FormBuilder, private commonService: CommonService, private modalHandler: ModealHandlerService) { }

  ngOnInit() {

    this.initForm()
    this.getOrgData();
    this.getRoleData();
    this.getOrgType();
  }

  initForm(): void {
    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      id: ['',],
      selectedRoleId: ['', Validators.required],
      selectedOrgtype: ['', Validators.required],
      selectedZone: ['']
    })
  }

  isSelected(item: any): boolean {
    return this.selectedOrg.some(selectedItem => selectedItem.id == item.id);
  }
  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  createOrganization() {
    this.visible = true;
  }

  closeDialog() {
    console.log('close function called');
    this.addedRoles = [];
    this.selectedRole = null
    this.orgForm.reset();
    this.visible = false;
    this.isEditable = false;
    this.isEditOrg = false;

  }

  // get availableRoles(): updatedRoleData[] {
  //   return this.updatedRoleData.filter((role: { id: number; }) => !this.addedRoles.some((addedRole) => addedRole.id === role.id))
  // }
  // get availableRoles(): updatedRoleData[] {
  //   if (!this.updatedRoleData || !this.addedRoles) return [];
  //   return this.updatedRoleData.filter(
  //     (role: any) => !this.addedRoles.some((addedRole) => addedRole.id === role.id)
  //   );
  // }

  //   get availableRoles(): updatedRoleData[] {
  //   return this.updatedRoleData.filter(
  //     role => !this.addedRoles.some(added => added.id === role.id)
  //   );
  // }


  updateSelectedRoles(event: any) {

    this.selectedRoles = event.value;
  }

  addRole() {

    if (this.selectedRole && !this.addedRoles.some(role => role.id === this.selectedRole!.id)) {
      this.addedRoles.push({ ...this.selectedRole },);
      console.log('here pushed', this.addedRoles);
      this.orgForm.get('selectedRoleId')?.reset(); // Resets the control cleanly
      this.selectedRole = null;

    }
  }

  removeRole(index: number) {
    this.addedRoles.splice(index, 1);
    if (this.addedRoles.length === 0) {
      this.selectedRole = null;
      this.orgForm.get('selectedRoleId')?.setValue('');
    }
  }


  addOrg() {

    this.orgForm.markAllAsTouched();

    const roleControl = this.orgForm.get('selectedRoleId');
    roleControl?.clearValidators();
    roleControl?.updateValueAndValidity();

    if (this.orgForm.invalid) {
      return;
    }

    if (this.orgForm.valid) {
      const formattedData = {
        name: this.orgForm.value?.name,
        zone: this.orgForm.value?.selectedZone,
        org_type_id: Number(this.orgForm.value?.selectedOrgtype),
        data: this.addedRoles.map((role, index) => ({
          occurance: (index + 1).toString(),
          role_id: role.id
        }))
      };

      this.commonService.createData('api/user/createOrg', formattedData).subscribe({
        next: (res: any) => {
          if (res.status == 201) {

            this.modalHandler.showToast(res.message || 'Org Added successfully', 'success');

            this.getOrgData();
            this.closeDialog()
          } else {

            this.modalHandler.showError(res.message || 'org Added gone Wrong');
            console.log('Invalid ', res);
          }

        },
        error: (err) => {
          console.error('Form Creation failed ', err);
        }
      });
    }
  }


  submitForm() {

    if (this.isEditing) {
      this.updateOrg();
    } else {
      this.addOrg();
    }



  }

  getRoleData() {
    this.commonService.getAllData('api/user/getAllRole').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.rolesData = res.data
          this.updatedRoleData = this.rolesData.filter(
            (role: any) => !['super admin', 'admin', 'nsm'].includes(role.name?.toLowerCase())
          );
          console.log('here are roles', this.rolesData);
        } else {
          console.log('Invalid ', res);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }



  getOrgType() {
    this.commonService.getAllData('api/user/getOrgType').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.orgTypeData = res.data
          console.log('here are org', this.orgTypeData);

        } else {

          console.log('Invalid ', res);
        }

      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }




  getOrgData() {
    console.log('here org function called');

    this.commonService.getAllData('api/user/getAllOrg').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          console.log(res.data, 'here is the org data');

          this.orgData = res.data
            .filter((org: any) => org.isactive === true)
            .map((org: {
              id: any, name: any; org_type_name: any, org_type_id: any, data: any[];
            }) => ({
              id: org.id,
              org_name: org.name,
              org_type_name: org.org_type_name,
              org_type_id: org.org_type_id,
              orgr_id: org.data.map((itr: { orgr_id: any; }) => itr.orgr_id),
              roles: org.data.map(role => role.role_name),
              temproles: org.data.map(role => ({
                orgr_id: role.orgr_id,
                role_name: role.role_name,
                occurrence: role.occurance,
                user_role_id: role.user_role_id,

              })),
              occurrences: org.data.map(role => role.occurance)
            }));

            this.tempOrgData = [...this.orgData];
          this.refinedData = res.data.map((org: { id: any; name: any; data: any[] }) => ({
            id: org.id,
            org_name: org.name,
            roles: org.data.map(role => ({
              orgr_id: role.orgr_id,
              role_name: role.role_name,
              occurrence: role.occurance,
              user_role_id: role.user_role_id
            }))
          }));
        } else {

          console.log('Invalid ', res);
        }

      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }


  electedRoleId: string = '';

  onRoleChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedRole = this.rolesData.find(role => role.id.toString() === selectedId) || null;
    console.log(this.selectedOrgRole, 'her is the selected role');

  }


  // editOrg(item: any) {
  //   console.log('Editing organization:', item);
  //   this.visible = true
  //   this.isEditOrg = true;

  //   this.isEditing = true;
  //   this.selectedOrgId = item.id;

  //   this.orgForm.patchValue({
  //     name: item.org_name,
  //     selectedOrgtype: item.org_type_name
  //   });


  //   if (item.temproles && Array.isArray(item.temproles)) {
  //     this.addedRoles = item.temproles
  //       .filter((role: any) => {
  //         const name = role.role_name?.toLowerCase();
  //         return name !== 'admin' && name !== 'super admin';
  //       })
  //       .map((role: any) => ({
  //         id: role.user_role_id,
  //         name: role.role_name,
  //         occurrence: role.occurrence
  //       }));
  //   }

  //   this.getRoleData()
  //   console.log("Populated addedRoles:", this.addedRoles);

  // }

  editOrg(item: any) {
    this.visible = true;
    this.isEditOrg = true;
    this.isEditing = true;
    this.selectedOrgId = item.id;

    this.orgForm.patchValue({
      name: item.org_name,
      selectedOrgtype: item.org_type_name
    });

    // Step 1: Fetch roles
    this.commonService.getAllData('api/user/getAllRole').subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          // Step 2: Filter out admin/super admin
          this.updatedRoleData = res.data.filter((role: any) =>
            !['admin', 'super admin'].includes(role.name?.toLowerCase())
          );

          // Step 3: Patch roles already assigned to org
          if (item.temproles && Array.isArray(item.temproles)) {
            this.addedRoles = item.temproles
              .filter((role: any) => {
                const name = role.role_name?.toLowerCase();
                return name !== 'admin' && name !== 'super admin';
              })
              .map((role: any) => ({
                id: role.user_role_id,
                name: role.role_name,
                occurrence: role.occurrence
              }));
          }
        }
      }
    });
  }

  get filteredDropdownRoles(): any[] {
    return this.updatedRoleData?.filter(
      role => !this.addedRoles?.some(added => +added.id === +role.id)
    ) || [];
  }




  get availableRoles(): updatedRoleData[] {
    if (!this.updatedRoleData || !this.addedRoles) return [];
    return this.updatedRoleData.filter(
      (role: any) => !this.addedRoles.some((added) => added.id === role.id)
    );
  }


  isRoleAlreadyAdded(roleId: number | string): boolean {
    return this.addedRoles.some(r => r.id === +roleId);
  }



  updateOrg() {


    const roleControl = this.orgForm.get('selectedRoleId');
    roleControl?.clearValidators();
    roleControl?.updateValueAndValidity();

    if (this.orgForm.valid) {
      const formattedData = {
        id: this.selectedOrgId,
        name: this.orgForm.value.name,
        data: this.addedRoles.map((role, index) => ({
          occurance: index + 1,
          user_role_id: Number(role.id)
        }))
      };

      this.commonService.updateData('api/user/updateOrg', formattedData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.modalHandler.showToast(res.message || 'Org Updated successfully', 'success');
            this.getOrgData();
            this.closeDialog();
          } else {
            this.modalHandler.showError(res.message || 'org Updation gone Wrong');
            console.log('Update failed', res);
          }
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    }
  }




  deleteOrg(item: any) {


    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete the Org. This action cannot be undone.',
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
        this.deleteOrgData(item)

      } else if (result.dismiss === Swal.DismissReason.cancel) {

       
      }
    });


  }



  deleteOrgData(item: any) {
    this.commonService.deleteData('api/user/deleteOrg/', item.id).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {

          this.getOrgData();
          this.modalHandler.showToast(res.message || 'Org Deleted successfully', 'success');
          this.closeDialog()
        } else {

          this.modalHandler.showError(res['message']);

          console.log('Invalid ', res);
        }
      },
      error: (err) => {
        Swal.fire('Cancelled', 'Your Org is safe :)', 'info');
        console.error('Login failed', err);
      }
    });
  }




  filterOrg(type: string): void {

    console.log('here is the type', type  );
    
     this.orgData = this.tempOrgData.filter(item =>
      item.org_type_name === type
    );

  }


  resetOrgFilter(){
    this.orgData = [...this.tempOrgData];
  }
}
