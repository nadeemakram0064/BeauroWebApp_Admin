import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { MydashboardComponent } from './demo/components/mydashboard/mydashboard.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'mydashboard', component: MydashboardComponent },
                    { path: 'requestqueue', loadChildren: () => import('./demo/components/Queue/requestqueue/requestqueue.module').then(m => m.RequestqueueModule) },
                    { path: 'requestqueuedetails-beauro', loadChildren: () => import('./demo/components/Queue/requestqueuedetails-beauro/requestqueuedetails-beauro.module').then(m => m.RequestqueuedetailsBeauroModule) },
                    { path: 'requestqueuedetails-individual', loadChildren: () => import('./demo/components/Queue/requestqueuedetails-individual/requestqueuedetails-individual.module').then(m => m.RequestqueuedetailsIndividualModule) },
                    { path: 'profiles/beauro', loadChildren: () => import('./demo/components/beauroprofiles/beauroprofiles.module').then(m => m.BeauroprofilesModule) },
                    { path: 'profiles/individual', loadChildren: () => import('./demo/components/individualprofiles/individualprofiles.module').then(m => m.IndividualprofilesModule) },
                    { path: 'setup/globalsettings', loadChildren: () => import('./demo/components/setup/globalsettings/globalsettings.module').then(m => m.GlobalsettingsModule) },
                    { path: 'setup/workflow', loadChildren: () => import('./demo/components/setup/workflow/workflow.module').then(m => m.WorkflowModule) },
                ],
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'pages/notfound', component: NotfoundComponent },
            { path: '**', redirectTo: 'pages/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
