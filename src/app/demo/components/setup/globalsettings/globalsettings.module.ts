import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalsettingsRoutingModule } from './globalsettings-routing.module';
import { GlobalsettingsComponent } from './globalsettings.component';

@NgModule({
    imports: [
        CommonModule,
        GlobalsettingsRoutingModule
    ],
    declarations: [GlobalsettingsComponent]
})
export class GlobalsettingsModule { }

