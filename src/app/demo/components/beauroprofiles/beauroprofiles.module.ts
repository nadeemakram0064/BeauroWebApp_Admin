import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeauroprofilesRoutingModule } from './beauroprofiles-routing.module';
import { BeauroprofilesComponent } from './beauroprofiles.component';

@NgModule({
    imports: [
        CommonModule,
        BeauroprofilesRoutingModule
    ],
    declarations: [BeauroprofilesComponent]
})
export class BeauroprofilesModule { }

