import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestqueuedetailsBeauroRoutingModule } from './requestqueuedetails-beauro-routing.module';
import { RequestqueuedetailsBeauroComponent } from './requestqueuedetails-beauro.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RequestqueuedetailsBeauroRoutingModule,
        ToolbarModule,
        ButtonModule,
        TabViewModule,
        TimelineModule,
        RatingModule,
        ToastModule,
        DropdownModule
    ],
    declarations: [RequestqueuedetailsBeauroComponent],
    providers: [MessageService]
})
export class RequestqueuedetailsBeauroModule { }