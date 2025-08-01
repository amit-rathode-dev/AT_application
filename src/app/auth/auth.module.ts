import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MessageModule } from 'primeng/message';

import { PasswordModule } from 'primeng/password';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';





@NgModule({
  declarations: [],
  imports: [

    CommonModule, 
    AuthRoutingModule,
    MessageModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
  ]
})
export class AuthModule { }
