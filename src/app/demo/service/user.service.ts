import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    status: string;
    phone?: string;
    department?: string;
    profileImageUrl?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password?: string;
    role: string;
    phone?: string;
    department?: string;
    isActive: boolean;
    profileImage?: File;
    profileImageUrl?: string;
}

export interface UpdateUserRequest {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
    phone?: string;
    department?: string;
    isActive: boolean;
    profileImage?: File;
    profileImageUrl?: string;
}

export interface UserFilters {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = '/api/users'; // Replace with your actual API base URL

    constructor(private http: HttpClient) { }

    // Get all users with optional filtering and pagination
    getUsers(filters?: UserFilters): Observable<PaginatedResponse<User>> {
        let params = new HttpParams();

        if (filters) {
            if (filters.search) params = params.set('search', filters.search);
            if (filters.role) params = params.set('role', filters.role);
            if (filters.status) params = params.set('status', filters.status);
            if (filters.page !== undefined) params = params.set('page', filters.page.toString());
            if (filters.size !== undefined) params = params.set('size', filters.size.toString());
            if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
            if (filters.sortDir) params = params.set('sortDir', filters.sortDir);
        }

        return this.http.get<PaginatedResponse<User>>(this.apiUrl, { params })
            .pipe(
                map(response => ({
                    ...response,
                    content: response.content.map(user => ({
                        ...user,
                        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
                        createdAt: new Date(user.createdAt),
                        updatedAt: new Date(user.updatedAt)
                    }))
                })),
                catchError(this.handleError)
            );
    }

    // Get user by ID
    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`)
            .pipe(
                map(user => ({
                    ...user,
                    lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt)
                })),
                catchError(this.handleError)
            );
    }

    // Create new user
    createUser(userData: CreateUserRequest): Observable<User> {
        return this.http.post<User>(this.apiUrl, userData)
            .pipe(
                map(user => ({
                    ...user,
                    lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt)
                })),
                catchError(this.handleError)
            );
    }

    // Update existing user
    updateUser(userData: UpdateUserRequest): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userData.id}`, userData)
            .pipe(
                map(user => ({
                    ...user,
                    lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
                    createdAt: new Date(user.createdAt),
                    updatedAt: new Date(user.updatedAt)
                })),
                catchError(this.handleError)
            );
    }

    // Delete/Deactivate user
    deactivateUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Bulk deactivate users
    bulkDeactivate(userIds: number[]): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/bulk-deactivate`, { userIds })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Bulk activate users
    bulkActivate(userIds: number[]): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/bulk-activate`, { userIds })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Reset user password
    resetPassword(id: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/reset-password`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Check if username is available
    checkUsernameAvailability(username: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.apiUrl}/check-username`, {
            params: { username }
        }).pipe(
            catchError(this.handleError)
        );
    }

    // Check if email is available
    checkEmailAvailability(email: string, excludeUserId?: number): Observable<boolean> {
        let params = new HttpParams().set('email', email);
        if (excludeUserId) {
            params = params.set('excludeUserId', excludeUserId.toString());
        }

        return this.http.get<boolean>(`${this.apiUrl}/check-email`, { params })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Export users to CSV
    exportUsers(filters?: UserFilters): Observable<Blob> {
        let params = new HttpParams();

        if (filters) {
            if (filters.search) params = params.set('search', filters.search);
            if (filters.role) params = params.set('role', filters.role);
            if (filters.status) params = params.set('status', filters.status);
        }

        return this.http.get(`${this.apiUrl}/export`, {
            params,
            responseType: 'blob'
        }).pipe(
            catchError(this.handleError)
        );
    }

    // Get user roles
    getRoles(): Observable<{ label: string; value: string }[]> {
        return this.http.get<{ label: string; value: string }[]>(`${this.apiUrl}/roles`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Get user statistics
    getUserStats(): Observable<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        pendingUsers: number;
    }> {
        return this.http.get<{
            totalUsers: number;
            activeUsers: number;
            inactiveUsers: number;
            pendingUsers: number;
        }>(`${this.apiUrl}/stats`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Get department options
    getDepartments(): Observable<{ label: string; value: string }[]> {
        return this.http.get<{ label: string; value: string }[]>(`${this.apiUrl}/departments`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Upload profile image
    uploadProfileImage(userId: number, file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('image', file);

        return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/${userId}/upload-image`, formData)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Delete profile image
    deleteProfileImage(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}/profile-image`)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
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
                        errorMessage = 'Resource not found';
                        break;
                    case 409:
                        errorMessage = 'Conflict - resource already exists';
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

        console.error('UserService Error:', error);
        return throwError(() => new Error(errorMessage));
    }
}
