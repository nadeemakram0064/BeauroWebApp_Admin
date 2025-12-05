import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorkflowComponent }
    ])],
    exports: [RouterModule]
})
export class WorkflowRoutingModule { }


