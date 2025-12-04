import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Request Queue', icon: 'pi pi-fw pi-list', routerLink: ['/requestqueue'] }
                ]
            },
            {
                label: 'Profiles',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Beauro Profiles',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/profiles/beauro']
                    },
                    {
                        label: 'Individual Profiles',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/profiles/individual']
                    }
                ]
            },
            {
                label: 'Setup',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Global Settings',
                        icon: 'pi pi-fw pi-sliders-h',
                        routerLink: ['/setup/globalsettings']
                    },
                    {
                        label: 'Workflow',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/setup/workflow']
                    }
                ]
            },
            {
                label: 'System',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                ]
            }
        ];
    }
}
