import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';

@NgModule({
    imports: [
        CommonModule,
        WorkflowRoutingModule
    ],
    declarations: [WorkflowComponent]
})
export class WorkflowModule { }

