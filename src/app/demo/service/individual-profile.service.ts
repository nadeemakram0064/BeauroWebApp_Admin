import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface IndividualProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    address: string;
    city: string;
    country: string;
    occupation: string;
    experience: string;
    skills: string[];
    languages: string[];
    verificationStatus: 'pending' | 'verified' | 'rejected';
    isActive: boolean;
    profileImageUrl?: string;
    documents: Document[];
    portfolioUrl?: string;
    linkedinUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    verifiedAt?: Date;
    rating: number;
    completedProjects: number;
    hourlyRate?: number;
    availabilityStatus: 'available' | 'busy' | 'unavailable';
}

export interface Document {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    verified: boolean;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'admin' | 'individual';
    message: string;
    timestamp: Date;
    attachments?: ChatAttachment[];
    read: boolean;
}

export interface ChatAttachment {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
}

export interface ChatConversation {
    id: string;
    individualId: string;
    individualName: string;
    lastMessage: ChatMessage;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IndividualFilters {
    search?: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    isActive?: boolean;
    city?: string;
    skills?: string[];
    availabilityStatus?: 'available' | 'busy' | 'unavailable';
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
export class IndividualProfileService {
    private apiUrl = '/api/individual-profiles';

    // Chat functionality
    private selectedConversationSubject = new BehaviorSubject<ChatConversation | null>(null);
    selectedConversation$ = this.selectedConversationSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Get all individual profiles with filtering and pagination
    getIndividualProfiles(filters?: IndividualFilters): Observable<PaginatedResponse<IndividualProfile>> {
        let params = new HttpParams();

        if (filters) {
            if (filters.search) params = params.set('search', filters.search);
            if (filters.verificationStatus) params = params.set('verificationStatus', filters.verificationStatus);
            if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
            if (filters.city) params = params.set('city', filters.city);
            if (filters.skills && filters.skills.length > 0) {
                filters.skills.forEach(skill => {
                    params = params.append('skills', skill);
                });
            }
            if (filters.availabilityStatus) params = params.set('availabilityStatus', filters.availabilityStatus);
            if (filters.page !== undefined) params = params.set('page', filters.page.toString());
            if (filters.size !== undefined) params = params.set('size', filters.size.toString());
            if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
            if (filters.sortDir) params = params.set('sortDir', filters.sortDir);
        }

        return this.http.get<PaginatedResponse<IndividualProfile>>(this.apiUrl, { params })
            .pipe(
                map(response => ({
                    ...response,
                    content: response.content.map(profile => ({
                        ...profile,
                        dateOfBirth: new Date(profile.dateOfBirth),
                        createdAt: new Date(profile.createdAt),
                        updatedAt: new Date(profile.updatedAt),
                        verifiedAt: profile.verifiedAt ? new Date(profile.verifiedAt) : undefined
                    }))
                })),
                catchError(this.handleError)
            );
    }

    // Get individual profile by ID
    getIndividualProfileById(id: string): Observable<IndividualProfile> {
        return this.http.get<IndividualProfile>(`${this.apiUrl}/${id}`)
            .pipe(
                map(profile => ({
                    ...profile,
                    dateOfBirth: new Date(profile.dateOfBirth),
                    createdAt: new Date(profile.createdAt),
                    updatedAt: new Date(profile.updatedAt),
                    verifiedAt: profile.verifiedAt ? new Date(profile.verifiedAt) : undefined,
                    documents: profile.documents.map(doc => ({
                        ...doc,
                        uploadedAt: new Date(doc.uploadedAt)
                    }))
                })),
                catchError(this.handleError)
            );
    }

    // Update individual profile
    updateIndividualProfile(id: string, updates: Partial<IndividualProfile>): Observable<IndividualProfile> {
        return this.http.put<IndividualProfile>(`${this.apiUrl}/${id}`, updates)
            .pipe(
                map(profile => ({
                    ...profile,
                    dateOfBirth: new Date(profile.dateOfBirth),
                    createdAt: new Date(profile.createdAt),
                    updatedAt: new Date(profile.updatedAt),
                    verifiedAt: profile.verifiedAt ? new Date(profile.verifiedAt) : undefined
                })),
                catchError(this.handleError)
            );
    }

    // Deactivate individual profile
    deactivateIndividualProfile(id: string, reason?: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/deactivate`, { reason })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Activate individual profile
    activateIndividualProfile(id: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/activate`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Verify individual profile
    verifyIndividualProfile(id: string, notes?: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/verify`, { notes })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Reject individual profile
    rejectIndividualProfile(id: string, reason: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/reject`, { reason })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Upload profile image
    uploadProfileImage(individualId: string, file: File): Observable<{ imageUrl: string }> {
        const formData = new FormData();
        formData.append('image', file);

        return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/${individualId}/upload-image`, formData)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Delete profile image
    deleteProfileImage(individualId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${individualId}/profile-image`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Get individual statistics
    getIndividualStats(): Observable<{
        totalIndividuals: number;
        activeIndividuals: number;
        pendingVerifications: number;
        verifiedIndividuals: number;
        rejectedIndividuals: number;
        availableIndividuals: number;
    }> {
        return this.http.get<{
            totalIndividuals: number;
            activeIndividuals: number;
            pendingVerifications: number;
            verifiedIndividuals: number;
            rejectedIndividuals: number;
            availableIndividuals: number;
        }>(`${this.apiUrl}/stats`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Chat functionality
    getChatConversations(): Observable<ChatConversation[]> {
        return this.http.get<ChatConversation[]>(`${this.apiUrl}/chat/conversations`)
            .pipe(
                map(conversations => conversations.map(conv => ({
                    ...conv,
                    createdAt: new Date(conv.createdAt),
                    updatedAt: new Date(conv.updatedAt),
                    lastMessage: {
                        ...conv.lastMessage,
                        timestamp: new Date(conv.lastMessage.timestamp)
                    }
                }))),
                catchError(this.handleError)
            );
    }

    getChatMessages(individualId: string): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(`${this.apiUrl}/${individualId}/chat/messages`)
            .pipe(
                map(messages => messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }))),
                catchError(this.handleError)
            );
    }

    sendChatMessage(individualId: string, message: string, attachments?: File[]): Observable<ChatMessage> {
        const formData = new FormData();
        formData.append('message', message);

        if (attachments) {
            attachments.forEach((file, index) => {
                formData.append(`attachment_${index}`, file);
            });
        }

        return this.http.post<ChatMessage>(`${this.apiUrl}/${individualId}/chat/send`, formData)
            .pipe(
                map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                })),
                catchError(this.handleError)
            );
    }

    markMessagesAsRead(individualId: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${individualId}/chat/mark-read`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Set selected conversation for chat
    setSelectedConversation(conversation: ChatConversation | null): void {
        this.selectedConversationSubject.next(conversation);
    }

    getSelectedConversation(): ChatConversation | null {
        return this.selectedConversationSubject.getValue();
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
                        errorMessage = 'Individual profile not found';
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

        console.error('IndividualProfileService Error:', error);
        return throwError(() => new Error(errorMessage));
    }
}
