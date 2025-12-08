import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndividualprofilesRoutingModule } from './individualprofiles-routing.module';
import { IndividualprofilesComponent } from './individualprofiles.component';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipModule } from 'primeng/chip';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IndividualprofilesRoutingModule,
        // PrimeNG modules
        TableModule,
        ToolbarModule,
        ButtonModule,
        CardModule,
        TagModule,
        RatingModule,
        DropdownModule,
        SelectButtonModule,
        InputTextModule,
        ProgressSpinnerModule,
        ToastModule,
        ConfirmDialogModule,
        ChipModule
    ],
    declarations: [IndividualprofilesComponent]
})
export class IndividualprofilesModule { }


