import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MessageService } from 'primeng/api';

interface Role {
    label: string;
    value: string;
}

@Component({
    selector: 'app-createaccount',
    templateUrl: './createaccount.component.html',
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

        :host ::ng-deep .p-dropdown {
            width: 100%;
        }

        :host ::ng-deep .p-dropdown .p-dropdown-label {
            padding: 1rem;
        }

        .p-error {
            color: #e74c3c;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
    `],
    providers: [MessageService]
})
export class CreateAccountComponent {

    // Form fields
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phone: string = '';
    password: string = '';
    confirmPassword: string = '';
    organization: string = '';
    selectedRole: string = '';
    acceptTerms: boolean = false;

    // Dropdown options
    roles: Role[] = [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
        { label: 'Viewer', value: 'viewer' }
    ];

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private messageService: MessageService
    ) { }

    onCreateAccount() {
        if (this.password !== this.confirmPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Passwords do not match'
            });
            return;
        }

        if (!this.acceptTerms) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'You must accept the terms and conditions'
            });
            return;
        }

        const accountData = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            password: this.password,
            organization: this.organization,
            role: this.selectedRole,
            acceptTerms: this.acceptTerms
        };

        console.log('Create account data:', accountData);

        // TODO: Implement your account creation logic here
        // For example: this.authService.createAccount(accountData).subscribe(
        //     (response) => {
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Success',
        //             detail: 'Account created successfully! Please check your email for verification.'
        //         });
        //         this.router.navigate(['/auth/login']);
        //     },
        //     (error) => {
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: 'Failed to create account. Please try again.'
        //         });
        //     }
        // );

        // For now, show success message and navigate to login (remove this when implementing actual auth service)
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account created successfully! Please check your email for verification.'
        });

        setTimeout(() => {
            this.router.navigate(['/auth/login']);
        }, 2000);
    }
}
