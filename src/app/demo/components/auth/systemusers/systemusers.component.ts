import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService, User, CreateUserRequest, UpdateUserRequest, UserFilters } from '../../../service/user.service';
import { finalize, map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

interface Role {
    label: string;
    value: string;
}

interface Status {
    label: string;
    value: string;
}

@Component({
    selector: 'app-systemusers',
    templateUrl: './systemusers.component.html',
    styles: [`
        /* DataTable Styles */
        .p-datatable .p-datatable-tbody > tr > td {
            padding: 0.75rem 0.5rem;
        }

        .p-datatable .p-datatable-thead > tr > th {
            padding: 1rem 0.5rem;
            font-weight: 600;
        }

        .field {
            margin-bottom: 1rem;
        }

        .field label {
            display: block;
            margin-bottom: 0.25rem;
            color: var(--text-color-secondary);
        }

        .field div {
            color: var(--text-color);
        }

        /* Professional Dialog Styles */
        .user-dialog .p-dialog-content {
            padding: 1.5rem !important;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .user-dialog .p-dialog-header {
            padding: 1.5rem 2rem;
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            border-radius: 12px 12px 0 0;
            border-bottom: none;
        }

        .user-dialog .p-dialog-header .p-dialog-title {
            font-size: 1.5rem;
            font-weight: 600;
        }

        .user-dialog .p-dialog-footer {
            padding: 1.5rem 2rem;
            background: #f8f9fa;
            border-top: 1px solid #dee2e6;
            border-radius: 0 0 12px 12px;
        }

        /* Profile Image Section */
        .profile-image-section {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 1.5rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            margin-bottom: 1.5rem;
        }

        .profile-image-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .profile-image-wrapper {
            position: relative;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        }

        .profile-image-wrapper:hover {
            transform: scale(1.05);
        }

        .profile-image {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .profile-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-text {
            font-size: 3rem;
            font-weight: 600;
            color: white;
        }

        .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
        }

        .profile-image-wrapper:hover .image-overlay {
            opacity: 1;
        }

        .image-upload-btn {
            color: white;
            text-align: center;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: background-color 0.3s ease;
        }

        .image-upload-btn:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .image-upload-btn i {
            display: block;
            font-size: 1.5rem;
            margin-bottom: 0.25rem;
        }

        .image-upload-btn span {
            display: block;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .remove-image-btn {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #dc3545;
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }

        .remove-image-btn:hover {
            background: #c82333;
            transform: scale(1.1);
        }

        .upload-status {
            margin-top: 1rem;
            text-align: center;
            color: #6c757d;
        }

        .upload-status i {
            margin-right: 0.5rem;
        }

        .profile-info {
            flex: 1;
        }

        .profile-title {
            margin: 0 0 0.5rem 0;
            color: #495057;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .profile-subtitle {
            margin: 0;
            color: #6c757d;
            font-size: 0.9rem;
            line-height: 1.4;
        }

        /* Form Grid Styles */
        .form-grid {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.2rem;
        }

        .form-field {
            display: flex;
            flex-direction: column;
        }

        .form-field.full-width {
            grid-column: 1 / -1;
        }

        .form-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .form-field input,
        .form-field p-dropdown,
        .form-field p-password {
            width: 100%;
        }

        .p-error {
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }

        /* Status Toggle */
        .status-toggle {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            background: white;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            margin-top: 0.5rem;
            position: relative;
            cursor: pointer;
        }

        .status-toggle:hover {
            border-color: #007bff;
        }

        .status-label {
            font-weight: 500;
            color: #495057;
            cursor: pointer;
            user-select: none;
            margin-left: 0.5rem;
            flex: 1;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .user-dialog {
                width: 95vw !important;
                max-width: 95vw !important;
            }

            .profile-image-section {
                flex-direction: column;
                text-align: center;
                gap: 1.5rem;
            }

            .form-row {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            .user-dialog .p-dialog-content {
                padding: 1rem !important;
            }

            .user-dialog .p-dialog-header,
            .user-dialog .p-dialog-footer {
                padding: 1rem;
            }
        }

        /* Custom scrollbar */
        .user-dialog ::-webkit-scrollbar {
            width: 6px;
        }

        .user-dialog ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .user-dialog ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .user-dialog ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        /* User Avatar in Table */
        .user-avatar-wrapper {
            position: relative;
        }

        .user-avatar-wrapper .p-avatar {
            border: 2px solid #e9ecef;
            transition: border-color 0.3s ease;
        }

        .user-avatar-wrapper .p-avatar:hover {
            border-color: #007bff;
        }

        /* User Detail Avatar */
        .user-detail-avatar .p-avatar {
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            border: 3px solid #e9ecef;
        }
    `],
    providers: [MessageService, ConfirmationService]
})
export class SystemUsersComponent implements OnInit {

    users: User[] = [];
    selectedUsers: User[] = [];
    userDialog: boolean = false;
    userDetailsDialog: boolean = false;
    editMode: boolean = false;
    loading: boolean = false;

    userForm: FormGroup;
    selectedUser: User | null = null;

    searchValue: string = '';
    globalFilterValue: string = '';

    // Pagination
    totalRecords: number = 0;
    rows: number = 10;
    first: number = 0;

    // Filters
    selectedRole: string = '';
    selectedStatus: string = '';

    roles: Role[] = [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'User', value: 'user' },
        { label: 'Viewer', value: 'viewer' }
    ];

    statuses: Status[] = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Pending', value: 'Pending' }
    ];

    departments: { label: string; value: string }[] = [
        { label: 'Information Technology', value: 'IT' },
        { label: 'Human Resources', value: 'HR' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Operations', value: 'Operations' },
        { label: 'Customer Support', value: 'Support' },
        { label: 'Executive', value: 'Executive' },
        { label: 'Legal', value: 'Legal' },
        { label: 'Research & Development', value: 'R&D' }
    ];

    // Image upload properties
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    isUploadingImage: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.userForm = this.fb.group({
            id: [null],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            username: ['', [Validators.required], [this.usernameValidator]],
            email: ['', [Validators.required, Validators.email], [this.emailValidator]],
            password: [''],
            role: ['', [Validators.required]],
            phone: [''],
            department: [''],
            profileImageUrl: [''],
            isActive: [true]
        });
    }

    // Custom validators
    usernameValidator = (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;

        return control.valueChanges.pipe(
            debounceTime(500),
            switchMap(username =>
                this.userService.checkUsernameAvailability(username).pipe(
                    map(isAvailable => isAvailable ? null : { usernameTaken: true }),
                    catchError(() => of(null)) // Ignore errors for validation
                )
            )
        );
    };

    emailValidator = (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;

        return control.valueChanges.pipe(
            debounceTime(500),
            switchMap(email =>
                this.userService.checkEmailAvailability(email, this.selectedUser?.id).pipe(
                    map(isAvailable => isAvailable ? null : { emailTaken: true }),
                    catchError(() => of(null)) // Ignore errors for validation
                )
            )
        );
    };

    ngOnInit(): void {
        this.loadUsers();
    }

    goBackToDashboard(): void {
        this.router.navigate(['/']);
    }

    loadUsers(): void {
        this.loading = true;

        const filters: UserFilters = {
            search: this.globalFilterValue || undefined,
            role: this.selectedRole || undefined,
            status: this.selectedStatus || undefined,
            page: Math.floor(this.first / this.rows),
            size: this.rows
        };

        this.userService.getUsers(filters)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (response) => {
                    this.users = response.content;
                    this.totalRecords = response.totalElements;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load users: ' + error.message
                    });
                }
            });
    }

    openNewUserDialog(): void {
        this.editMode = false;
        this.userForm.reset();
        this.userForm.patchValue({ isActive: true });
        this.userDialog = true;
    }

    editUser(user: User): void {
        this.editMode = true;
        this.selectedUser = user;

        // Split name into first and last name
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        this.userForm.patchValue({
            id: user.id,
            firstName: firstName,
            lastName: lastName,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            department: user.department || '',
            profileImageUrl: user.profileImageUrl || '',
            isActive: user.status === 'Active'
        });

        // Set image preview if user has profile image
        if (user.profileImageUrl) {
            this.imagePreview = user.profileImageUrl;
        }

        this.userDialog = true;
    }

    saveUser(): void {
        if (this.userForm.valid) {
            const formValue = this.userForm.value;

            if (this.editMode && this.selectedUser) {
                // Update existing user
                const updateData: UpdateUserRequest = {
                    id: this.selectedUser.id,
                    firstName: formValue.firstName,
                    lastName: formValue.lastName,
                    username: formValue.username,
                    email: formValue.email,
                    role: formValue.role,
                    phone: formValue.phone,
                    department: formValue.department,
                    isActive: formValue.isActive
                };

                this.userService.updateUser(updateData)
                    .subscribe({
                        next: (updatedUser) => {
                            const index = this.users.findIndex(u => u.id === updatedUser.id);
                            if (index !== -1) {
                                this.users[index] = updatedUser;

                                // Upload image if selected
                                if (this.selectedFile) {
                                    this.uploadImage(updatedUser.id);
                                }
                            }
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'User updated successfully'
                            });
                            this.hideDialog();
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update user: ' + error.message
                            });
                        }
                    });
            } else {
                // Create new user
                const createData: CreateUserRequest = {
                    firstName: formValue.firstName,
                    lastName: formValue.lastName,
                    username: formValue.username,
                    email: formValue.email,
                    password: formValue.password,
                    role: formValue.role,
                    phone: formValue.phone,
                    department: formValue.department,
                    isActive: formValue.isActive
                };

                this.userService.createUser(createData)
                    .subscribe({
                        next: (newUser) => {
                            this.users.unshift(newUser); // Add to beginning of array
                            this.totalRecords++;

                            // Upload image if selected
                            if (this.selectedFile) {
                                this.uploadImage(newUser.id);
                            }

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'User created successfully'
                            });
                            this.hideDialog();
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to create user: ' + error.message
                            });
                        }
                    });
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please fill in all required fields correctly'
            });
        }
    }

    hideDialog(): void {
        this.userDialog = false;
        this.userForm.reset();
        this.editMode = false;
        this.selectedUser = null;
        this.selectedFile = null;
        this.imagePreview = null;
        this.isUploadingImage = false;
    }

    confirmDeleteUser(user: User): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to deactivate ${user.name}?`,
            header: 'Confirm Deactivation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deactivateUser(user);
            }
        });
    }

    deactivateUser(user: User): void {
        this.userService.deactivateUser(user.id)
            .subscribe({
                next: () => {
                    const index = this.users.findIndex(u => u.id === user.id);
                    if (index !== -1) {
                        this.users[index].status = 'Inactive';
                        this.users[index].updatedAt = new Date();
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User deactivated successfully'
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to deactivate user: ' + error.message
                    });
                }
            });
    }

    resetPassword(user: User): void {
        this.confirmationService.confirm({
            message: `Send password reset email to ${user.name}?`,
            header: 'Reset Password',
            icon: 'pi pi-question-circle',
            accept: () => {
                this.userService.resetPassword(user.id)
                    .subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Password reset email sent successfully'
                            });
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to send password reset: ' + error.message
                            });
                        }
                    });
            }
        });
    }

    viewUserDetails(user: User): void {
        this.selectedUser = user;
        this.userDetailsDialog = true;
    }

    bulkDeactivate(): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to deactivate ${this.selectedUsers.length} selected user(s)?`,
            header: 'Bulk Deactivation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const userIds = this.selectedUsers.map(user => user.id);
                this.userService.bulkDeactivate(userIds)
                    .subscribe({
                        next: () => {
                            this.selectedUsers.forEach(user => {
                                user.status = 'Inactive';
                                user.updatedAt = new Date();
                            });
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: `${this.selectedUsers.length} user(s) deactivated successfully`
                            });
                            this.clearSelection();
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to deactivate users: ' + error.message
                            });
                        }
                    });
            }
        });
    }

    bulkActivate(): void {
        const userIds = this.selectedUsers.map(user => user.id);
        this.userService.bulkActivate(userIds)
            .subscribe({
                next: () => {
                    this.selectedUsers.forEach(user => {
                        user.status = 'Active';
                        user.updatedAt = new Date();
                    });
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `${this.selectedUsers.length} user(s) activated successfully`
                    });
                    this.clearSelection();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to activate users: ' + error.message
                    });
                }
            });
    }

    clearSelection(): void {
        this.selectedUsers = [];
    }

    // Image upload methods
    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage(): void {
        this.selectedFile = null;
        this.imagePreview = null;
        this.userForm.patchValue({ profileImageUrl: '' });
    }

    uploadImage(userId: number): void {
        if (this.selectedFile && userId) {
            this.isUploadingImage = true;
            this.userService.uploadProfileImage(userId, this.selectedFile)
                .subscribe({
                    next: (response) => {
                        this.userForm.patchValue({ profileImageUrl: response.imageUrl });
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Profile image uploaded successfully'
                        });
                        this.selectedFile = null;
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to upload profile image: ' + error.message
                        });
                    }
                }).add(() => {
                    this.isUploadingImage = false;
                });
        }
    }

    getAvatarDisplay(user?: User | null): string {
        if (this.imagePreview) return this.imagePreview;
        if (user?.profileImageUrl) return user.profileImageUrl;
        if (user?.name) return user.name.charAt(0).toUpperCase();
        return '?';
    }

    getAvatarType(user?: User | null): 'text' | 'image' {
        return (this.imagePreview || user?.profileImageUrl) ? 'image' : 'text';
    }

    toggleAccountStatus(): void {
        const currentValue = this.userForm.get('isActive')?.value;
        this.userForm.patchValue({ isActive: !currentValue });
    }

    exportUsers(): void {
        const filters: UserFilters = {
            search: this.globalFilterValue || undefined,
            role: this.selectedRole || undefined,
            status: this.selectedStatus || undefined
        };

        this.userService.exportUsers(filters)
            .subscribe({
                next: (blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'system_users.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Users exported successfully'
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to export users: ' + error.message
                    });
                }
            });
    }

    convertToCSV(data: any[]): string {
        if (data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => `"${row[header] || ''}"`).join(',')
            )
        ];

        return csvRows.join('\n');
    }

    onSearch(event: any): void {
        this.searchValue = event.target.value;
    }

    onGlobalFilter(table: Table, event: Event): void {
        this.globalFilterValue = (event.target as HTMLInputElement).value;
        this.first = 0; // Reset to first page when filtering
        this.loadUsers();
    }

    onPageChange(event: any): void {
        this.first = event.first;
        this.rows = event.rows;
        this.loadUsers();
    }

    onRoleFilter(event: any): void {
        this.selectedRole = event.value;
        this.first = 0; // Reset to first page when filtering
        this.loadUsers();
    }

    onStatusFilter(event: any): void {
        this.selectedStatus = event.value;
        this.first = 0; // Reset to first page when filtering
        this.loadUsers();
    }

    getRoleSeverity(role: string): string {
        const severityMap: { [key: string]: string } = {
            'super-admin': 'danger',
            'admin': 'warning',
            'manager': 'info',
            'user': 'success',
            'viewer': 'secondary'
        };
        return severityMap[role] || 'secondary';
    }

    getStatusSeverity(status: string): string {
        const severityMap: { [key: string]: string } = {
            'Active': 'success',
            'Inactive': 'danger',
            'Pending': 'warning'
        };
        return severityMap[status] || 'secondary';
    }

    getAvatarColor(name: string): string {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    }

}
