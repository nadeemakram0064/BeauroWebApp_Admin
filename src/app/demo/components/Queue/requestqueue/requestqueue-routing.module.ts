import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestqueueComponent } from './requestqueue.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RequestqueueComponent }
    ])],
    exports: [RouterModule]
})
export class RequestqueueRoutingModule { }


