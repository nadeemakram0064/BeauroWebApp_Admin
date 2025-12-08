import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BeauroProfileService, BeauroProfile, ChatMessage, ChatConversation, BeauroFilters } from '../../service/beauro-profile.service';
import { finalize } from 'rxjs/operators';

interface ViewMode {
    list: boolean;
    detail: boolean;
    chat: boolean;
}

@Component({
    selector: 'app-beauroprofiles',
    templateUrl: './beauroprofiles.component.html',
    styleUrls: ['./beauroprofiles.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class BeauroprofilesComponent implements OnInit {
    @ViewChild('dt') dt: Table | undefined;

    // Data
    beauroProfiles: BeauroProfile[] = [];
    selectedProfile: BeauroProfile | null = null;
    chatConversations: ChatConversation[] = [];
    selectedConversation: ChatConversation | null = null;
    chatMessages: ChatMessage[] = [];

    // View modes
    viewMode: ViewMode = {
        list: true,
        detail: false,
        chat: false
    };

    // Loading states
    loading: boolean = false;
    chatLoading: boolean = false;
    sendingMessage: boolean = false;

    // Pagination
    totalRecords: number = 0;
    rows: number = 10;
    first: number = 0;

    // Filters
    selectedVerificationStatus: string = 'verified';
    selectedActiveStatus: boolean = true;
    globalFilterValue: string = '';

    // Chat
    newMessage: string = '';
    selectedChatFiles: File[] = [];

    // Statistics
    stats = {
        totalBeauros: 0,
        activeBeauros: 0,
        pendingVerifications: 0,
        verifiedBeauros: 0,
        rejectedBeauros: 0
    };

    verificationStatusOptions = [
        { label: 'All', value: null },
        { label: 'Verified', value: 'verified' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];

    constructor(
        private router: Router,
        private beauroProfileService: BeauroProfileService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.loadDummyData();
        this.loadStats();
        this.loadChatConversations();
    }

    loadDummyData(): void {
        // Load dummy data for demonstration
        this.beauroProfiles = [
            {
                id: '1',
                companyName: 'TechSolutions Inc.',
                contactPerson: 'John Smith',
                email: 'john@techsolutions.com',
                phone: '+1-555-0123',
                businessLicense: 'BL123456789',
                address: '123 Business Ave',
                city: 'New York',
                country: 'USA',
                website: 'https://techsolutions.com',
                description: 'Leading technology solutions provider specializing in software development and digital transformation.',
                services: ['Software Development', 'Web Development', 'Mobile Apps', 'Cloud Solutions'],
                verificationStatus: 'verified',
                isActive: true,
                profileImageUrl: '',
                documents: [
                    {
                        id: 'doc1',
                        name: 'Business License.pdf',
                        type: 'pdf',
                        url: '/documents/license.pdf',
                        uploadedAt: new Date('2024-01-15'),
                        verified: true
                    },
                    {
                        id: 'doc2',
                        name: 'Tax Certificate.pdf',
                        type: 'pdf',
                        url: '/documents/tax.pdf',
                        uploadedAt: new Date('2024-01-16'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-12-06'),
                verifiedAt: new Date('2024-01-20'),
                rating: 4.8,
                totalProjects: 45,
                completedProjects: 42
            },
            {
                id: '2',
                companyName: 'Global Marketing Pro',
                contactPerson: 'Sarah Johnson',
                email: 'sarah@globalmarketing.com',
                phone: '+1-555-0124',
                businessLicense: 'BL987654321',
                address: '456 Marketing Blvd',
                city: 'Los Angeles',
                country: 'USA',
                website: 'https://globalmarketing.com',
                description: 'Full-service marketing agency providing digital marketing, branding, and advertising solutions.',
                services: ['Digital Marketing', 'Brand Strategy', 'Social Media', 'SEO'],
                verificationStatus: 'verified',
                isActive: true,
                profileImageUrl: '',
                documents: [
                    {
                        id: 'doc3',
                        name: 'Business Registration.pdf',
                        type: 'pdf',
                        url: '/documents/registration.pdf',
                        uploadedAt: new Date('2024-02-01'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-01-25'),
                updatedAt: new Date('2024-12-05'),
                verifiedAt: new Date('2024-02-05'),
                rating: 4.6,
                totalProjects: 38,
                completedProjects: 35
            },
            {
                id: '3',
                companyName: 'BuildMasters Construction',
                contactPerson: 'Mike Davis',
                email: 'mike@buildmasters.com',
                phone: '+1-555-0125',
                businessLicense: 'BL456789123',
                address: '789 Construction Rd',
                city: 'Chicago',
                country: 'USA',
                website: 'https://buildmasters.com',
                description: 'Professional construction company specializing in residential and commercial building projects.',
                services: ['Construction', 'Renovation', 'Architecture', 'Project Management'],
                verificationStatus: 'pending',
                isActive: true,
                profileImageUrl: '',
                documents: [],
                createdAt: new Date('2024-11-15'),
                updatedAt: new Date('2024-12-01'),
                rating: 0,
                totalProjects: 0,
                completedProjects: 0
            },
            {
                id: '4',
                companyName: 'Creative Design Studio',
                contactPerson: 'Emma Wilson',
                email: 'emma@creativedesign.com',
                phone: '+1-555-0126',
                businessLicense: 'BL789123456',
                address: '321 Design Street',
                city: 'Miami',
                country: 'USA',
                website: 'https://creativedesign.com',
                description: 'Creative design studio offering graphic design, web design, and branding services.',
                services: ['Graphic Design', 'Web Design', 'Branding', 'UI/UX Design'],
                verificationStatus: 'verified',
                isActive: false,
                profileImageUrl: '',
                documents: [
                    {
                        id: 'doc4',
                        name: 'Portfolio.pdf',
                        type: 'pdf',
                        url: '/documents/portfolio.pdf',
                        uploadedAt: new Date('2024-03-10'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-03-01'),
                updatedAt: new Date('2024-11-20'),
                verifiedAt: new Date('2024-03-15'),
                rating: 4.9,
                totalProjects: 67,
                completedProjects: 65
            },
            {
                id: '5',
                companyName: 'Data Analytics Pro',
                contactPerson: 'Alex Chen',
                email: 'alex@dataanalytics.com',
                phone: '+1-555-0127',
                businessLicense: 'BL321654987',
                address: '654 Data Drive',
                city: 'Seattle',
                country: 'USA',
                website: 'https://dataanalytics.com',
                description: 'Data analytics and business intelligence solutions provider.',
                services: ['Data Analysis', 'Business Intelligence', 'Machine Learning', 'Data Visualization'],
                verificationStatus: 'rejected',
                isActive: false,
                profileImageUrl: '',
                documents: [],
                createdAt: new Date('2024-10-01'),
                updatedAt: new Date('2024-11-15'),
                rating: 0,
                totalProjects: 0,
                completedProjects: 0
            },
            {
                id: '6',
                companyName: 'Green Energy Solutions',
                contactPerson: 'Lisa Rodriguez',
                email: 'lisa@greenenergy.com',
                phone: '+1-555-0128',
                businessLicense: 'BL654987321',
                address: '987 Energy Lane',
                city: 'Austin',
                country: 'USA',
                website: 'https://greenenergy.com',
                description: 'Sustainable energy solutions and renewable energy consulting.',
                services: ['Solar Energy', 'Wind Energy', 'Energy Consulting', 'Sustainability'],
                verificationStatus: 'verified',
                isActive: true,
                profileImageUrl: '',
                documents: [
                    {
                        id: 'doc5',
                        name: 'Certifications.pdf',
                        type: 'pdf',
                        url: '/documents/certifications.pdf',
                        uploadedAt: new Date('2024-04-01'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-03-20'),
                updatedAt: new Date('2024-12-04'),
                verifiedAt: new Date('2024-04-05'),
                rating: 4.7,
                totalProjects: 23,
                completedProjects: 21
            }
        ];

        // Initialize chat conversations
        this.chatConversations = [
            {
                id: 'chat1',
                beauroId: '1',
                beauroName: 'TechSolutions Inc.',
                lastMessage: {
                    id: 'msg1',
                    senderId: 'admin',
                    senderName: 'Admin',
                    senderType: 'admin',
                    message: 'Please provide the updated project timeline.',
                    timestamp: new Date('2024-12-06T10:30:00'),
                    read: false
                },
                unreadCount: 2,
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-12-06T10:30:00')
            },
            {
                id: 'chat2',
                beauroId: '2',
                beauroName: 'Global Marketing Pro',
                lastMessage: {
                    id: 'msg2',
                    senderId: 'sarah',
                    senderName: 'Sarah Johnson',
                    senderType: 'beauro',
                    message: 'The campaign design is ready for your review.',
                    timestamp: new Date('2024-12-05T15:45:00'),
                    read: true
                },
                unreadCount: 0,
                createdAt: new Date('2024-10-15'),
                updatedAt: new Date('2024-12-05T15:45:00')
            }
        ];

        this.loadBeauroProfiles();
    }

    loadBeauroProfiles(): void {
        this.loading = true;

        // Simulate API delay
        setTimeout(() => {
            let filteredProfiles = [...this.beauroProfiles];

            // Apply filters
            if (this.selectedVerificationStatus && this.selectedVerificationStatus !== 'null') {
                filteredProfiles = filteredProfiles.filter(profile =>
                    profile.verificationStatus === this.selectedVerificationStatus
                );
            }

            if (this.selectedActiveStatus !== null) {
                filteredProfiles = filteredProfiles.filter(profile =>
                    profile.isActive === this.selectedActiveStatus
                );
            }

            if (this.globalFilterValue) {
                const searchTerm = this.globalFilterValue.toLowerCase();
                filteredProfiles = filteredProfiles.filter(profile =>
                    profile.companyName.toLowerCase().includes(searchTerm) ||
                    profile.contactPerson.toLowerCase().includes(searchTerm) ||
                    profile.email.toLowerCase().includes(searchTerm) ||
                    profile.city.toLowerCase().includes(searchTerm)
                );
            }

            // Apply pagination
            this.totalRecords = filteredProfiles.length;
            const startIndex = this.first;
            const endIndex = startIndex + this.rows;
            this.beauroProfiles = filteredProfiles.slice(startIndex, endIndex);

            this.loading = false;
        }, 500);
    }

    loadStats(): void {
        // Calculate stats from dummy data
        const allProfiles = [
            {
                id: '1', companyName: 'TechSolutions Inc.', verificationStatus: 'verified', isActive: true, totalProjects: 45, completedProjects: 42
            },
            {
                id: '2', companyName: 'Global Marketing Pro', verificationStatus: 'verified', isActive: true, totalProjects: 38, completedProjects: 35
            },
            {
                id: '3', companyName: 'BuildMasters Construction', verificationStatus: 'pending', isActive: true, totalProjects: 0, completedProjects: 0
            },
            {
                id: '4', companyName: 'Creative Design Studio', verificationStatus: 'verified', isActive: false, totalProjects: 67, completedProjects: 65
            },
            {
                id: '5', companyName: 'Data Analytics Pro', verificationStatus: 'rejected', isActive: false, totalProjects: 0, completedProjects: 0
            },
            {
                id: '6', companyName: 'Green Energy Solutions', verificationStatus: 'verified', isActive: true, totalProjects: 23, completedProjects: 21
            }
        ];

        this.stats = {
            totalBeauros: allProfiles.length,
            activeBeauros: allProfiles.filter(p => p.isActive).length,
            pendingVerifications: allProfiles.filter(p => p.verificationStatus === 'pending').length,
            verifiedBeauros: allProfiles.filter(p => p.verificationStatus === 'verified').length,
            rejectedBeauros: allProfiles.filter(p => p.verificationStatus === 'rejected').length
        };
    }

    loadChatConversations(): void {
        this.beauroProfileService.getChatConversations()
            .subscribe({
                next: (conversations) => {
                    this.chatConversations = conversations;
                },
                error: (error) => {
                    console.error('Failed to load chat conversations:', error);
                }
            });
    }

    onPageChange(event: any): void {
        this.first = event.first;
        this.rows = event.rows;
        this.loadBeauroProfiles();
    }

    onGlobalFilter(table: Table, event: Event): void {
        this.globalFilterValue = (event.target as HTMLInputElement).value;
        this.first = 0; // Reset to first page when filtering
        this.loadBeauroProfiles();
    }

    onVerificationStatusFilter(event: any): void {
        this.selectedVerificationStatus = event.value;
        this.first = 0;
        this.loadBeauroProfiles();
    }

    onActiveStatusFilter(event: any): void {
        this.selectedActiveStatus = event.value;
        this.first = 0;
        this.loadBeauroProfiles();
    }

    viewProfileDetails(profile: BeauroProfile): void {
        this.selectedProfile = profile;
        this.viewMode = { list: false, detail: true, chat: false };
    }

    openChat(profile: BeauroProfile): void {
        this.selectedProfile = profile;
        this.loadChatMessages(profile.id);
        this.viewMode = { list: false, detail: false, chat: true };
    }

    loadChatMessages(beauroId: string): void {
        this.chatLoading = true;
        this.beauroProfileService.getChatMessages(beauroId)
            .pipe(finalize(() => this.chatLoading = false))
            .subscribe({
                next: (messages) => {
                    this.chatMessages = messages;
                    this.markMessagesAsRead(beauroId);
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load chat messages: ' + error.message
                    });
                }
            });
    }

    markMessagesAsRead(beauroId: string): void {
        this.beauroProfileService.markMessagesAsRead(beauroId)
            .subscribe({
                error: (error) => {
                    console.error('Failed to mark messages as read:', error);
                }
            });
    }

    sendMessage(): void {
        if (!this.newMessage.trim() && this.selectedChatFiles.length === 0) return;
        if (!this.selectedProfile) return;

        this.sendingMessage = true;
        this.beauroProfileService.sendChatMessage(
            this.selectedProfile.id,
            this.newMessage,
            this.selectedChatFiles.length > 0 ? this.selectedChatFiles : undefined
        )
        .pipe(finalize(() => this.sendingMessage = false))
        .subscribe({
            next: (message) => {
                this.chatMessages.push(message);
                this.newMessage = '';
                this.selectedChatFiles = [];
                this.scrollToBottom();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to send message: ' + error.message
                });
            }
        });
    }

    onFileSelected(event: any): void {
        const files = Array.from(event.target.files) as File[];
        this.selectedChatFiles = [...this.selectedChatFiles, ...files];
    }

    removeChatFile(index: number): void {
        this.selectedChatFiles.splice(index, 1);
    }

    scrollToBottom(): void {
        setTimeout(() => {
            const chatContainer = document.querySelector('.chat-messages');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 100);
    }

    deactivateProfile(profile: BeauroProfile): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to deactivate ${profile.companyName}?`,
            header: 'Confirm Deactivation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.beauroProfileService.deactivateBeauroProfile(profile.id, 'Deactivated by admin')
                    .subscribe({
                        next: () => {
                            profile.isActive = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Beauro profile deactivated successfully'
                            });
                            this.loadStats();
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to deactivate profile: ' + error.message
                            });
                        }
                    });
            }
        });
    }

    activateProfile(profile: BeauroProfile): void {
        this.beauroProfileService.activateBeauroProfile(profile.id)
            .subscribe({
                next: () => {
                    profile.isActive = true;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Beauro profile activated successfully'
                    });
                    this.loadStats();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to activate profile: ' + error.message
                    });
                }
            });
    }

    goBack(): void {
        this.viewMode = { list: true, detail: false, chat: false };
        this.selectedProfile = null;
        this.selectedConversation = null;
        this.chatMessages = [];
    }

    goBackToDetail(): void {
        this.viewMode = { list: false, detail: true, chat: false };
    }

    getVerificationStatusSeverity(status: string): string {
        const severityMap: { [key: string]: string } = {
            'verified': 'success',
            'pending': 'warning',
            'rejected': 'danger'
        };
        return severityMap[status] || 'secondary';
    }

    getStatusIcon(status: string): string {
        const iconMap: { [key: string]: string } = {
            'verified': 'pi pi-check-circle',
            'pending': 'pi pi-clock',
            'rejected': 'pi pi-times-circle'
        };
        return iconMap[status] || 'pi pi-question-circle';
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getExperienceYears(createdDate: Date): number {
        return new Date().getFullYear() - createdDate.getFullYear();
    }
}


