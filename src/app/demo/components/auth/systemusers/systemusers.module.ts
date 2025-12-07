import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SystemUsersRoutingModule } from './systemusers-routing.module';
import { SystemUsersComponent } from './systemusers.component';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService, ConfirmationService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SystemUsersRoutingModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        ToolbarModule,
        DialogModule,
        DropdownModule,
        PasswordModule,
        CheckboxModule,
        ToastModule,
        ConfirmDialogModule,
        TagModule,
        AvatarModule,
        PaginatorModule
    ],
    declarations: [SystemUsersComponent],
    providers: [MessageService, ConfirmationService]
})
export class SystemUsersModule { }
