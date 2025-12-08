import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WorkflowService, Workflow, WorkflowType, CreateWorkflowRequest, UpdateWorkflowRequest, WorkflowFilters } from '../../../service/workflow.service';
import { UserService, User } from '../../../service/user.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-workflow',
    templateUrl: './workflow.component.html',
    styleUrls: ['./workflow.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class WorkflowComponent implements OnInit {

    // Form
    workflowForm: FormGroup;
    isSubmitting: boolean = false;

    // Data
    workflows: Workflow[] = [];
    users: User[] = [];
    workflowTypes: { label: string; value: WorkflowType; description: string }[] = [];

    // UI state
    loading: boolean = false;
    editingWorkflow: Workflow | null = null;
    showAddForm: boolean = false;

    // Filters
    filters: WorkflowFilters = {};
    globalFilterValue: string = '';

    constructor(
        private fb: FormBuilder,
        private workflowService: WorkflowService,
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.workflowForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            type: ['', Validators.required],
            description: ['', Validators.maxLength(500)],
            assignedUserId: ['', Validators.required],
            isActive: [true]
        });
    }

    ngOnInit(): void {
        this.workflowTypes = this.workflowService.getWorkflowTypes();
        this.loadWorkflows();
        this.loadUsers();
    }

    loadWorkflows(): void {
        this.loading = true;
        this.workflowService.getWorkflows(this.filters)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (workflows) => {
                    this.workflows = workflows;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load workflows: ' + error.message
                    });
                }
            });
    }

    loadUsers(): void {
        this.userService.getUsers({ size: 1000 })
            .subscribe({
                next: (response) => {
                    this.users = response.content || [];
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

    onSubmit(): void {
        if (this.workflowForm.valid) {
            this.isSubmitting = true;

            const formValue = this.workflowForm.value;
            const request: CreateWorkflowRequest = {
                name: formValue.name,
                type: formValue.type,
                description: formValue.description,
                assignedUserId: formValue.assignedUserId,
                isActive: formValue.isActive
            };

            this.workflowService.createWorkflow(request)
                .pipe(finalize(() => this.isSubmitting = false))
                .subscribe({
                    next: (newWorkflow) => {
                        this.workflows.unshift(newWorkflow);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Workflow created successfully'
                        });
                        this.resetForm();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create workflow: ' + error.message
                        });
                    }
                });
        } else {
            this.markFormGroupTouched(this.workflowForm);
        }
    }

    editWorkflow(workflow: Workflow): void {
        this.editingWorkflow = workflow;
        this.workflowForm.patchValue({
            name: workflow.name,
            type: workflow.type,
            description: workflow.description || '',
            assignedUserId: workflow.assignedUserId,
            isActive: workflow.isActive
        });
        this.showAddForm = true;
    }

    updateWorkflow(): void {
        if (this.workflowForm.valid && this.editingWorkflow) {
            this.isSubmitting = true;

            const formValue = this.workflowForm.value;
            const request: UpdateWorkflowRequest = {
                id: this.editingWorkflow.id,
                name: formValue.name,
                type: formValue.type,
                description: formValue.description,
                assignedUserId: formValue.assignedUserId,
                isActive: formValue.isActive
            };

            this.workflowService.updateWorkflow(request)
                .pipe(finalize(() => this.isSubmitting = false))
                .subscribe({
                    next: (updatedWorkflow) => {
                        const index = this.workflows.findIndex(w => w.id === updatedWorkflow.id);
                        if (index !== -1) {
                            this.workflows[index] = updatedWorkflow;
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Workflow updated successfully'
                        });
                        this.cancelEdit();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update workflow: ' + error.message
                        });
                    }
                });
        }
    }

    deleteWorkflow(workflow: Workflow): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete the workflow "${workflow.name}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.workflowService.deleteWorkflow(workflow.id)
                    .subscribe({
                        next: () => {
                            this.workflows = this.workflows.filter(w => w.id !== workflow.id);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Workflow deleted successfully'
                            });
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to delete workflow: ' + error.message
                            });
                        }
                    });
            }
        });
    }

    toggleWorkflowStatus(workflow: Workflow): void {
        this.workflowService.toggleWorkflowStatus(workflow.id)
            .subscribe({
                next: (updatedWorkflow) => {
                    const index = this.workflows.findIndex(w => w.id === updatedWorkflow.id);
                    if (index !== -1) {
                        this.workflows[index] = updatedWorkflow;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Workflow ${updatedWorkflow.isActive ? 'activated' : 'deactivated'} successfully`
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to toggle workflow status: ' + error.message
                    });
                }
            });
    }

    resetForm(): void {
        this.workflowForm.reset({
            isActive: true
        });
        this.editingWorkflow = null;
        this.showAddForm = false;
    }

    cancelEdit(): void {
        this.resetForm();
    }

    toggleAddForm(): void {
        this.showAddForm = !this.showAddForm;
        if (!this.showAddForm) {
            this.resetForm();
        }
    }

    applyFilters(): void {
        this.filters.search = this.globalFilterValue || undefined;
        this.loadWorkflows();
    }

    clearFilters(): void {
        this.filters = {};
        this.globalFilterValue = '';
        this.loadWorkflows();
    }

    getWorkflowTypeLabel(type: WorkflowType): string {
        const typeObj = this.workflowTypes.find(t => t.value === type);
        return typeObj ? typeObj.label : type;
    }

    getUserName(userId: number): string {
        const user = this.users.find(u => u.id === userId);
        return user ? user.name : 'Unknown User';
    }

    // Statistics methods for template
    getActiveWorkflowsCount(): number {
        return this.workflows.filter(w => w.isActive).length;
    }

    getApprovalWorkflowsCount(): number {
        return this.workflows.filter(w => w.type === 'approval').length;
    }

    getAutomatedWorkflowsCount(): number {
        return this.workflows.filter(w => w.type === 'automated').length;
    }

    getWorkflowTypeColor(type: WorkflowType): string {
        const colorMap: { [key in WorkflowType]: string } = {
            'approval': '#28a745',
            'notification': '#007bff',
            'automated': '#6f42c1',
            'manual': '#fd7e14',
            'conditional': '#dc3545'
        };
        return colorMap[type] || '#6c757d';
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }
}


