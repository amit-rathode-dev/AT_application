import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommontableComponent } from '../../shared/commontable/commontable.component';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommontableComponent,CommonModule,DropdownModule,DialogModule,ReactiveFormsModule],
    providers: [MessageService],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  
    @Output() onClose = new EventEmitter<void>()
    @Output() onSubmit = new EventEmitter<any>()

  
      visible:boolean=false

     addUser!: FormGroup
       
       productCategories: any[] = [
         { name: "Category 1", value: "cat1" },
         { name: "Category 2", value: "cat2" },
         { name: "Category 3", value: "cat3" },
       ]
     
       ratings: any[] = [
         { name: "1 Star", value: 1 },
         { name: "2 Stars", value: 2 },
         { name: "3 Stars", value: 3 },
         { name: "4 Stars", value: 4 },
         { name: "5 Stars", value: 5 },
       ]
     
       quantities: any[] = [
         { name: "1-10", value: "1-10" },
         { name: "11-50", value: "11-50" },
         { name: "51-100", value: "51-100" },
         { name: "100+", value: "100+" },
       ]
  messageService: any;
     
constructor(private fb:FormBuilder,private activatedRoute:ActivatedRoute){}

ngOnInit():void{


  this.activatedRoute.params.subscribe(params => {

    this.visible = params['visible']? true :false;
    console.log('visible',this.visible);


  });
  this.initForm()


 
}
       
  initForm(): void {
    this.addUser = this.fb.group({
      firstName: [""],
      lastName: [""],
      email: ["", [Validators.required, Validators.email]],
      companyName: [""],
      phoneNumber: [""],
      confirmEmail: [""],
      productCategory: [""],
      rating: [""],
      quantity: [""],
      notes: [""],
    })
  }



  

  createUser(): void {
    this.messageService.add({
      severity: "info",
      summary: "Create User",
      detail: "Create user functionality triggered",
    })
  }

  editUser(user: any): void {
    this.messageService.add({
      severity: "info",
      summary: "Edit User",
      detail: `Editing user: ${user.name}`,
    })
  }

  deleteUser(user: any): void {
    this.messageService.add({
      severity: "warn",
      summary: "Delete User",
      detail: `Deleting user: ${user.name}`,
    })
  }

 

  closeDialog(): void {
    this.visible = false; 
  }



  
  submitForm() {
    if (this.addUser.valid) {
      console.log('Form Data:', this.addUser.value);
      this.closeDialog();
    }
  }
  openDialog() {
    this.visible = true;  
  }


}
