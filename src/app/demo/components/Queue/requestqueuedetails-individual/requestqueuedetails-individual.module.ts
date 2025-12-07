import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestqueuedetailsIndividualRoutingModule } from './requestqueuedetails-individual-routing.module';
import { RequestqueuedetailsIndividualComponent } from './requestqueuedetails-individual.component';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RequestqueuedetailsIndividualRoutingModule,
        ButtonModule,
        TabViewModule,
        ToastModule
    ],
    declarations: [RequestqueuedetailsIndividualComponent],
    providers: [MessageService]
})
export class RequestqueuedetailsIndividualModule { }

