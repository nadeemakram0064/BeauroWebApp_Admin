import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    email!: string;
    password!: string;
    rememberMe: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private router: Router
    ) { }

    onLogin() {
        const loginData = {
            email: this.email,
            password: this.password,
            rememberMe: this.rememberMe
        };
        
        console.log('Login data:', loginData);
        // TODO: Implement your login logic here
        // For example: this.authService.login(loginData).subscribe(
        //     (response) => {
        //         // On successful login
        //         this.router.navigate(['/mydashboard']);
        //     },
        //     (error) => {
        //         // Handle error
        //     }
        // );
        
        // For now, navigate directly (remove this when implementing actual auth service)
        this.router.navigate(['/mydashboard']);
    }
}
