import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestqueuedetailsIndividualComponent } from './requestqueuedetails-individual.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RequestqueuedetailsIndividualComponent }
    ])],
    exports: [RouterModule]
})
export class RequestqueuedetailsIndividualRoutingModule { }

