import { Component, ViewChild, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse, departmentData, roles } from '../../../helpers/models/masters';



interface updatedRoleData {
  id: string
  name: string
}

@Component({
  selector: 'app-hierarchy',
  standalone: true,
  imports: [CommonModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule],
  templateUrl: './hierarchy.component.html',
  styleUrl: './hierarchy.component.css'
})
export class HierarchyComponent {

  selectedUser: any
  users: any[] = [];
  orgData: any[] = [];
  refinedData: any[] = [];
  tempData: any[] = [];
  tempOrgData: any[] = [];
  rolesData: any[] = [];
  selectedOrg: any[] = [];
  orgTypeData: any[] = []
  updatedRoleData: any[] = []
  departmentData: any[] = [];
  tempDepartment: any[] = []
  hierarchyData: any[] = [];
  zoneData: any[] = [{
    id: 'south', name: 'south'
  }, { id: 'north', name: 'north' },
  { id: 'west', name: 'west' },
  { id: 'central', name: 'central' }];

  tempOrg: any[] = [{ id: 1, name: 'AT' }, { id: 2, name: 'Orbit' }, { id: 3, name: 'ZS' }, { id: 4, name: 'S&P' }]

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
  destroy$ = new Subject<void>();




  @ViewChild('dt') table!: Table;


  constructor(private fb: FormBuilder, private commonService: CommonService, private modalHandler: ModealHandlerService,) { }

  ngOnInit() {

    this.initForm()
    this.getAllHierarchyData();
    this.getRoleData();
    this.getOrgData();

  }

  initForm(): void {
    this.orgForm = this.fb.group({

      id: [''],
      selectedRoleId: [null, Validators.required],
      selectedOrgtype: [null, Validators.required],
      selectedDepartment: [null, Validators.required],

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
      this.orgForm.get('selectedRoleId')?.reset(); // Resets the control cleanlycm
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
        department_id: Number(this.orgForm.value?.selectedDepartment),
        org_id: Number(this.orgForm.value?.selectedOrgtype),
        // org_type_id: Number(this.orgForm.value?.selectedOrgtype),
        data: this.addedRoles.map((role, index) => ({
          occurance: (index + 1).toString(),
          role_id: role.id
        }))
      };

      this.commonService.createData('api/user/createHirearchy', formattedData).subscribe({
        next: (res: any) => {
          if (res.status == 201) {

            this.modalHandler.showToast(res.message || 'Org Added successfully', 'success');

            this.getAllHierarchyData();
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
            (role: any) => !['super admin', 'admin'].includes(role.name?.toLowerCase())
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



  getOrgData() {
    console.log('here org function called');

    this.commonService.getAllData('api/user/getAllOrg').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          console.log(res.data, 'here is the org data');

          this.tempOrg = res.data
            .filter((org: any) => org.isactive === true)
            .map((org: {
              id: any, name: any; zone: string, org_type_id: any, org_type_name: any, department: any[];
            }) => ({
              id: org.id,
              org_name: org.name,
              zone: org.zone,
              org_type_name: org.org_type_name,
              org_type_id: org.org_type_id,
              // orgr_id: org.department?.map((itr: { orgr_id: any; }) => itr.orgr_id) ?? [],
              roles: Array.isArray(org.department) ? org.department.map(itr => itr.department_name) : [],
              tempOrg: Array.isArray(org.department) ? org.department.map(role => ({
                department_id: role.department_id,
                department_name: role.department_name,
                odr_id: role.odr_id,
              })) : [],
              // occurrences: org.department.map(role => role.occurance)
            }));


          console.log('here is the org data', this.orgData);


          this.tempOrgData = [...this.orgData];
          if (res.data && res.data.length > 0) {
            this.refinedData = res.data.map((org: { id: any; name: any; zone: string; org_type_name: string; data: any[] }) => ({
              id: org.id,
              org_name: org.name,
              zone: org.zone,
              org_type_name: org.org_type_name,
              roles: Array.isArray(org.data)
                ? org.data.map(role => ({
                  department_id: role.department_id,
                  department_name: role.department_name,
                  odr_id: role.odr_id,
                }))
                : []
            }));
          } else {
            this.refinedData = [];
          }
        } else {

          console.log('Invalid ', res);
        }

      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }





  getAllHierarchyData() {
    console.log('here org function called');

    this.commonService.getAllData('api/user/getAllHierarchy').subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 304) {
          console.log(res.data, 'here is the org data');

          this.hierarchyData = res.data
            // .filter((org: any) => org.isactive === true)
            .map((org: {
              org_id: any, org_name: any, department_name: any, department_id: any, role: any[];
            }) => ({
              org_id: org.org_id,
              org_name: org.org_name,
              department_name: org.department_name,
              department_id: org.department_id,
              
              temproles: (org.role ?? []).map((role: any) => ({
                role_name: role.role_name,
                occurrence: role.occurance,
                user_role_id: role.user_role_id,
              })),
              // occurrences: org.data.map(role => role.occurance)
            }));


          console.log('here is the hierarchy data=====>', this.hierarchyData);


          // this.tempOrgData = [...this.orgData];
          // this.refinedData = res.data.map((org: { id: any; name: any; data: any[] }) => ({
          //   id: org.id,
          //   org_name: org.name,
          //   roles: org.data.map(role => ({
          //     orgr_id: role.orgr_id,
          //     role_name: role.role_name,
          //     occurrence: role.occurance,
          //     user_role_id: role.user_role_id
          //   }))
          // }));
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
            this.getAllHierarchyData();
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

          this.getAllHierarchyData();
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

    console.log('here is the type', type);

    this.orgData = this.tempOrgData.filter(item =>
      item.org_type_name === type
    );

  }


  resetOrgFilter() {
    this.orgData = [...this.tempOrgData];
  }


  rolesReset(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value) {
      this.addedRoles = [];
    }
  }

  getDepartment(event: Event) {
    const selectedOrg = event.target as HTMLSelectElement;
    this.departmentData = [];
    if (selectedOrg.value) {
      console.log('Selected Org ID:', selectedOrg.value);
      this.getDepartmentData(selectedOrg.value)


    } else {
      this.tempDepartment = []
    }

  }


  getDepartmentData(id: any) {
    console.log('called getDepartmentdata with id:', id);

    this.commonService.getAllDataWithParams('api/user/getDepartmentMappedToOrgById', { org_id: id })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const response = res as ApiResponse<departmentData[]>;

          this.departmentData = response.data || [];

          // this.departmentData=this.roles;
          // this.applyRoleNameValidators();
          // this.applyDepartmentValidators();

        },
        error: (err) => {
          this.modalHandler.showError(
            err.error.message ? err.error.message : 'Something went wrong!'
          );
        }
      });
  }


  get avallableRoles() {
  return this.updatedRoleData.filter(
    dept => !this.addedRoles.some(added => added.id === dept.id)
  );
}

}