import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualprofilesRoutingModule } from './individualprofiles-routing.module';
import { IndividualprofilesComponent } from './individualprofiles.component';

@NgModule({
    imports: [
        CommonModule,
        IndividualprofilesRoutingModule
    ],
    declarations: [IndividualprofilesComponent]
})
export class IndividualprofilesModule { }

