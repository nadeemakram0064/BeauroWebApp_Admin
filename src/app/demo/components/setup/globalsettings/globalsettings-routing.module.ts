import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalsettingsComponent } from './globalsettings.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: GlobalsettingsComponent }
    ])],
    exports: [RouterModule]
})
export class GlobalsettingsRoutingModule { }


