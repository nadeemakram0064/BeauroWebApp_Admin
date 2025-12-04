import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestqueueRoutingModule } from './requestqueue-routing.module';
import { RequestqueueComponent } from './requestqueue.component';

@NgModule({
    imports: [
        CommonModule,
        RequestqueueRoutingModule
    ],
    declarations: [RequestqueueComponent]
})
export class RequestqueueModule { }

