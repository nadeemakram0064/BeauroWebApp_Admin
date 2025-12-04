import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BeauroprofilesComponent } from './beauroprofiles.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: BeauroprofilesComponent }
    ])],
    exports: [RouterModule]
})
export class BeauroprofilesRoutingModule { }

