import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type WorkflowType = 'approval' | 'notification' | 'automated' | 'manual' | 'conditional';

export interface Workflow {
    id: string;
    name: string;
    type: WorkflowType;
    description?: string;
    assignedUserId: number;
    assignedUser?: {
        id: number;
        name: string;
        username: string;
        email: string;
    };
    isActive: boolean;
    steps?: WorkflowStep[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}

export interface WorkflowStep {
    id: string;
    name: string;
    description?: string;
    order: number;
    type: 'action' | 'condition' | 'notification';
    config?: any;
}

export interface CreateWorkflowRequest {
    name: string;
    type: WorkflowType;
    description?: string;
    assignedUserId: number;
    isActive: boolean;
    steps?: WorkflowStep[];
}

export interface UpdateWorkflowRequest {
    id: string;
    name?: string;
    type?: WorkflowType;
    description?: string;
    assignedUserId?: number;
    isActive?: boolean;
    steps?: WorkflowStep[];
}

export interface WorkflowFilters {
    search?: string;
    type?: WorkflowType;
    assignedUserId?: number;
    isActive?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class WorkflowService {
    private apiUrl = '/api/workflows';

    // Local storage for demo purposes - in production, this would be API calls
    private workflowsSubject = new BehaviorSubject<Workflow[]>([]);
    public workflows$ = this.workflowsSubject.asObservable();

    private workflowTypes: { label: string; value: WorkflowType; description: string }[] = [
        { label: 'Approval', value: 'approval', description: 'Requires manual approval' },
        { label: 'Notification', value: 'notification', description: 'Sends notifications' },
        { label: 'Automated', value: 'automated', description: 'Fully automated process' },
        { label: 'Manual', value: 'manual', description: 'Manual execution required' },
        { label: 'Conditional', value: 'conditional', description: 'Based on conditions' }
    ];

    constructor(private http: HttpClient) {
        this.loadInitialWorkflows();
    }

    getWorkflowTypes() {
        return this.workflowTypes;
    }

    // Get all workflows with optional filtering
    getWorkflows(filters?: WorkflowFilters): Observable<Workflow[]> {
        // For demo purposes, return local data with filtering
        return this.workflows$.pipe(
            map(workflows => {
                let filtered = workflows;

                if (filters?.search) {
                    const search = filters.search.toLowerCase();
                    filtered = filtered.filter(w =>
                        w.name.toLowerCase().includes(search) ||
                        w.description?.toLowerCase().includes(search) ||
                        w.assignedUser?.name.toLowerCase().includes(search)
                    );
                }

                if (filters?.type) {
                    filtered = filtered.filter(w => w.type === filters.type);
                }

                if (filters?.assignedUserId) {
                    filtered = filtered.filter(w => w.assignedUserId === filters.assignedUserId);
                }

                if (filters?.isActive !== undefined) {
                    filtered = filtered.filter(w => w.isActive === filters.isActive);
                }

                return filtered.map(workflow => ({
                    ...workflow,
                    createdAt: new Date(workflow.createdAt),
                    updatedAt: new Date(workflow.updatedAt)
                }));
            })
        );
    }

    // Get workflow by ID
    getWorkflowById(id: string): Observable<Workflow | undefined> {
        return this.workflows$.pipe(
            map(workflows => workflows.find(w => w.id === id)),
            map(workflow => workflow ? {
                ...workflow,
                createdAt: new Date(workflow.createdAt),
                updatedAt: new Date(workflow.updatedAt)
            } : undefined)
        );
    }

    // Create new workflow
    createWorkflow(request: CreateWorkflowRequest): Observable<Workflow> {
        const newWorkflow: Workflow = {
            id: this.generateId(),
            name: request.name,
            type: request.type,
            description: request.description,
            assignedUserId: request.assignedUserId,
            isActive: request.isActive,
            steps: request.steps || [],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'admin',
            updatedBy: 'admin'
        };

        const currentWorkflows = this.workflowsSubject.value;
        this.workflowsSubject.next([...currentWorkflows, newWorkflow]);

        return new Observable(observer => {
            observer.next(newWorkflow);
            observer.complete();
        });
    }

    // Update existing workflow
    updateWorkflow(request: UpdateWorkflowRequest): Observable<Workflow> {
        const currentWorkflows = this.workflowsSubject.value;
        const workflowIndex = currentWorkflows.findIndex(w => w.id === request.id);

        if (workflowIndex === -1) {
            return throwError(() => new Error('Workflow not found'));
        }

        const updatedWorkflow: Workflow = {
            ...currentWorkflows[workflowIndex],
            ...request,
            updatedAt: new Date(),
            updatedBy: 'admin'
        };

        const newWorkflows = [...currentWorkflows];
        newWorkflows[workflowIndex] = updatedWorkflow;
        this.workflowsSubject.next(newWorkflows);

        return new Observable(observer => {
            observer.next(updatedWorkflow);
            observer.complete();
        });
    }

    // Delete workflow
    deleteWorkflow(id: string): Observable<void> {
        const currentWorkflows = this.workflowsSubject.value;
        const filteredWorkflows = currentWorkflows.filter(w => w.id !== id);
        this.workflowsSubject.next(filteredWorkflows);

        return new Observable(observer => {
            observer.next();
            observer.complete();
        });
    }

    // Toggle workflow active status
    toggleWorkflowStatus(id: string): Observable<Workflow> {
        const currentWorkflows = this.workflowsSubject.value;
        const workflow = currentWorkflows.find(w => w.id === id);

        if (!workflow) {
            return throwError(() => new Error('Workflow not found'));
        }

        return this.updateWorkflow({
            id,
            isActive: !workflow.isActive
        });
    }

    private generateId(): string {
        return 'workflow_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Load some initial demo workflows
    private loadInitialWorkflows(): void {
        const initialWorkflows: Workflow[] = [
            {
                id: 'workflow_1',
                name: 'User Registration Approval',
                type: 'approval',
                description: 'Workflow for approving new user registrations',
                assignedUserId: 1,
                assignedUser: {
                    id: 1,
                    name: 'John Admin',
                    username: 'john_admin',
                    email: 'john.admin@example.com'
                },
                isActive: true,
                steps: [
                    {
                        id: 'step_1',
                        name: 'Initial Review',
                        description: 'Review user information',
                        order: 1,
                        type: 'action'
                    },
                    {
                        id: 'step_2',
                        name: 'Approval Decision',
                        description: 'Approve or reject registration',
                        order: 2,
                        type: 'condition'
                    }
                ],
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15'),
                createdBy: 'system',
                updatedBy: 'system'
            },
            {
                id: 'workflow_2',
                name: 'Profile Verification Notification',
                type: 'notification',
                description: 'Send notifications for profile verification requests',
                assignedUserId: 2,
                assignedUser: {
                    id: 2,
                    name: 'Sarah Manager',
                    username: 'sarah_manager',
                    email: 'sarah.manager@example.com'
                },
                isActive: true,
                steps: [
                    {
                        id: 'step_3',
                        name: 'Send Notification',
                        description: 'Notify assigned user about verification request',
                        order: 1,
                        type: 'notification'
                    }
                ],
                createdAt: new Date('2024-01-20'),
                updatedAt: new Date('2024-01-20'),
                createdBy: 'system',
                updatedBy: 'system'
            },
            {
                id: 'workflow_3',
                name: 'Automated Backup Process',
                type: 'automated',
                description: 'Daily automated backup of system data',
                assignedUserId: 1,
                assignedUser: {
                    id: 1,
                    name: 'John Admin',
                    username: 'john_admin',
                    email: 'john.admin@example.com'
                },
                isActive: false,
                steps: [
                    {
                        id: 'step_4',
                        name: 'Data Backup',
                        description: 'Create system backup',
                        order: 1,
                        type: 'action'
                    },
                    {
                        id: 'step_5',
                        name: 'Verification',
                        description: 'Verify backup integrity',
                        order: 2,
                        type: 'action'
                    }
                ],
                createdAt: new Date('2024-02-01'),
                updatedAt: new Date('2024-02-01'),
                createdBy: 'system',
                updatedBy: 'system'
            }
        ];

        this.workflowsSubject.next(initialWorkflows);
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            if (error.error && typeof error.error === 'object' && error.error.message) {
                errorMessage = error.error.message;
            } else if (error.status) {
                switch (error.status) {
                    case 400:
                        errorMessage = 'Invalid request data';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized access';
                        break;
                    case 403:
                        errorMessage = 'Access forbidden';
                        break;
                    case 404:
                        errorMessage = 'Workflow not found';
                        break;
                    case 409:
                        errorMessage = 'Workflow already exists';
                        break;
                    case 422:
                        errorMessage = 'Validation failed';
                        break;
                    case 500:
                        errorMessage = 'Internal server error';
                        break;
                    default:
                        errorMessage = `Server error: ${error.status}`;
                }
            }
        }

        console.error('WorkflowService Error:', error);
        return throwError(() => new Error(errorMessage));
    }
}
