import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IndividualprofilesComponent } from './individualprofiles.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: IndividualprofilesComponent }
    ])],
    exports: [RouterModule]
})
export class IndividualprofilesRoutingModule { }

