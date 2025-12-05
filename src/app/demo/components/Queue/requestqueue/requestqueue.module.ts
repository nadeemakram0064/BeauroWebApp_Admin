import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestqueueRoutingModule } from './requestqueue-routing.module';
import { RequestqueueComponent } from './requestqueue.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
    imports: [
        CommonModule,
        RequestqueueRoutingModule,
        TableModule,
        ToastModule,
        ButtonModule,
        ToggleButtonModule,
        RatingModule,
        FormsModule,
        InputTextModule,
        DropdownModule,
        MultiSelectModule,
        SliderModule,
        ProgressBarModule
    ],
    declarations: [RequestqueueComponent]
})
export class RequestqueueModule { }


