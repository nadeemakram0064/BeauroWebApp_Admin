import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalsettingsRoutingModule } from './globalsettings-routing.module';
import { GlobalsettingsComponent } from './globalsettings.component';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        GlobalsettingsRoutingModule,
        // PrimeNG modules
        TableModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        DropdownModule,
        InputTextareaModule,
        InputSwitchModule,
        TagModule,
        ToolbarModule,
        ToastModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        CheckboxModule,
        TooltipModule
    ],
    declarations: [GlobalsettingsComponent]
})
export class GlobalsettingsModule { }


