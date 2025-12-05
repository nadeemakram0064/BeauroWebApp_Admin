import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestqueuedetailsBeauroComponent } from './requestqueuedetails-beauro.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RequestqueuedetailsBeauroComponent }
    ])],
    exports: [RouterModule]
})
export class RequestqueuedetailsBeauroRoutingModule { }

