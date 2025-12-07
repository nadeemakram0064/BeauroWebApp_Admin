import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SystemUsersComponent } from './systemusers.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SystemUsersComponent }
    ])],
    exports: [RouterModule]
})
export class SystemUsersRoutingModule { }
