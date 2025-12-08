import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IndividualProfileService, IndividualProfile, ChatMessage, ChatConversation, IndividualFilters } from '../../service/individual-profile.service';
import { finalize } from 'rxjs/operators';

interface ViewMode {
    list: boolean;
    detail: boolean;
    chat: boolean;
}

@Component({
    selector: 'app-individualprofiles',
    templateUrl: './individualprofiles.component.html',
    styleUrls: ['./individualprofiles.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class IndividualprofilesComponent implements OnInit {
    @ViewChild('dt') dt: Table | undefined;

    // Data
    individualProfiles: IndividualProfile[] = [];
    selectedProfile: IndividualProfile | null = null;
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
    selectedAvailabilityStatus: string = '';
    globalFilterValue: string = '';

    // Chat
    newMessage: string = '';
    selectedChatFiles: File[] = [];

    // Statistics
    stats = {
        totalIndividuals: 0,
        activeIndividuals: 0,
        pendingVerifications: 0,
        verifiedIndividuals: 0,
        rejectedIndividuals: 0,
        availableIndividuals: 0
    };

    verificationStatusOptions = [
        { label: 'All', value: null },
        { label: 'Verified', value: 'verified' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];

    availabilityStatusOptions = [
        { label: 'All', value: null },
        { label: 'Available', value: 'available' },
        { label: 'Busy', value: 'busy' },
        { label: 'Unavailable', value: 'unavailable' }
    ];

    constructor(
        private router: Router,
        private individualProfileService: IndividualProfileService,
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
        this.individualProfiles = [
            {
                id: '1',
                firstName: 'Michael',
                lastName: 'Johnson',
                email: 'michael.johnson@email.com',
                phone: '+1-555-0101',
                dateOfBirth: new Date('1990-05-15'),
                address: '123 Developer Street',
                city: 'San Francisco',
                country: 'USA',
                occupation: 'Full Stack Developer',
                experience: '5 years',
                skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'React', 'Python'],
                languages: ['English', 'Spanish'],
                verificationStatus: 'verified',
                isActive: true,
                profileImageUrl: '',
                portfolioUrl: 'https://michael-portfolio.com',
                linkedinUrl: 'https://linkedin.com/in/michaeljohnson',
                documents: [
                    {
                        id: 'doc1',
                        name: 'Resume.pdf',
                        type: 'pdf',
                        url: '/documents/resume1.pdf',
                        uploadedAt: new Date('2024-01-10'),
                        verified: true
                    },
                    {
                        id: 'doc2',
                        name: 'Certificate.pdf',
                        type: 'pdf',
                        url: '/documents/cert1.pdf',
                        uploadedAt: new Date('2024-01-11'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-01-05'),
                updatedAt: new Date('2024-12-06'),
                verifiedAt: new Date('2024-01-15'),
                rating: 4.9,
                completedProjects: 28,
                hourlyRate: 75,
                availabilityStatus: 'available'
            },
            {
                id: '2',
                firstName: 'Emily',
                lastName: 'Davis',
                email: 'emily.davis@email.com',
                phone: '+1-555-0102',
                dateOfBirth: new Date('1988-03-22'),
                address: '456 Designer Avenue',
                city: 'New York',
                country: 'USA',
                occupation: 'UI/UX Designer',
                experience: '7 years',
                skills: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision'],
                languages: ['English', 'French'],
                verificationStatus: 'verified',
                isActive: true,
                profileImageUrl: '',
                portfolioUrl: 'https://emily-designs.com',
                linkedinUrl: 'https://linkedin.com/in/emilydavis',
                documents: [
                    {
                        id: 'doc3',
                        name: 'Portfolio.pdf',
                        type: 'pdf',
                        url: '/documents/portfolio1.pdf',
                        uploadedAt: new Date('2024-02-01'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-01-20'),
                updatedAt: new Date('2024-12-05'),
                verifiedAt: new Date('2024-02-05'),
                rating: 4.8,
                completedProjects: 45,
                hourlyRate: 85,
                availabilityStatus: 'available'
            },
            {
                id: '3',
                firstName: 'David',
                lastName: 'Brown',
                email: 'david.brown@email.com',
                phone: '+1-555-0103',
                dateOfBirth: new Date('1992-08-10'),
                address: '789 Analyst Blvd',
                city: 'Austin',
                country: 'USA',
                occupation: 'Data Analyst',
                experience: '4 years',
                skills: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Excel'],
                languages: ['English'],
                verificationStatus: 'pending',
                isActive: true,
                profileImageUrl: '',
                documents: [],
                createdAt: new Date('2024-11-10'),
                updatedAt: new Date('2024-12-01'),
                rating: 0,
                completedProjects: 0,
                hourlyRate: 65,
                availabilityStatus: 'available'
            },
            {
                id: '4',
                firstName: 'Sarah',
                lastName: 'Wilson',
                email: 'sarah.wilson@email.com',
                phone: '+1-555-0104',
                dateOfBirth: new Date('1985-12-03'),
                address: '321 Writer Lane',
                city: 'Portland',
                country: 'USA',
                occupation: 'Content Writer',
                experience: '8 years',
                skills: ['Content Writing', 'SEO', 'Copywriting', 'Blogging', 'Technical Writing'],
                languages: ['English', 'German'],
                verificationStatus: 'verified',
                isActive: false,
                profileImageUrl: '',
                portfolioUrl: 'https://sarah-writes.com',
                documents: [
                    {
                        id: 'doc4',
                        name: 'Writing Samples.pdf',
                        type: 'pdf',
                        url: '/documents/samples.pdf',
                        uploadedAt: new Date('2024-03-15'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-03-01'),
                updatedAt: new Date('2024-11-25'),
                verifiedAt: new Date('2024-03-20'),
                rating: 4.7,
                completedProjects: 89,
                hourlyRate: 50,
                availabilityStatus: 'busy'
            },
            {
                id: '5',
                firstName: 'James',
                lastName: 'Miller',
                email: 'james.miller@email.com',
                phone: '+1-555-0105',
                dateOfBirth: new Date('1995-06-18'),
                address: '654 Mobile Street',
                city: 'Seattle',
                country: 'USA',
                occupation: 'Mobile App Developer',
                experience: '3 years',
                skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
                languages: ['English', 'Japanese'],
                verificationStatus: 'rejected',
                isActive: false,
                profileImageUrl: '',
                documents: [],
                createdAt: new Date('2024-09-15'),
                updatedAt: new Date('2024-10-20'),
                rating: 0,
                completedProjects: 0,
                hourlyRate: 60,
                availabilityStatus: 'unavailable'
            },
            {
                id: '6',
                firstName: 'Lisa',
                lastName: 'Garcia',
                email: 'lisa.garcia@email.com',
                phone: '+1-555-0106',
                dateOfBirth: new Date('1987-09-27'),
                address: '987 Marketing Road',
                city: 'Miami',
                country: 'USA',
                occupation: 'Digital Marketing Specialist',
                experience: '6 years',
                skills: ['Google Ads', 'Facebook Ads', 'SEO', 'SEM', 'Analytics', 'Social Media'],
                languages: ['English', 'Portuguese'],
                verificationStatus: 'verified',
                isActive: true,
                profileImageUrl: '',
                portfolioUrl: 'https://lisa-marketing.com',
                linkedinUrl: 'https://linkedin.com/in/lisagarcia',
                documents: [
                    {
                        id: 'doc5',
                        name: 'Marketing Certifications.pdf',
                        type: 'pdf',
                        url: '/documents/certs.pdf',
                        uploadedAt: new Date('2024-04-01'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-03-15'),
                updatedAt: new Date('2024-12-04'),
                verifiedAt: new Date('2024-04-05'),
                rating: 4.6,
                completedProjects: 52,
                hourlyRate: 70,
                availabilityStatus: 'available'
            },
            {
                id: '7',
                firstName: 'Robert',
                lastName: 'Taylor',
                email: 'robert.taylor@email.com',
                phone: '+1-555-0107',
                dateOfBirth: new Date('1983-11-12'),
                address: '147 Consultant Ave',
                city: 'Denver',
                country: 'USA',
                occupation: 'Business Consultant',
                experience: '10 years',
                skills: ['Business Analysis', 'Strategy', 'Project Management', 'Agile', 'Scrum'],
                languages: ['English', 'Mandarin'],
                verificationStatus: 'verified',
                isActive: true,
                profileImageUrl: '',
                linkedinUrl: 'https://linkedin.com/in/roberttaylor',
                documents: [
                    {
                        id: 'doc6',
                        name: 'Consulting Credentials.pdf',
                        type: 'pdf',
                        url: '/documents/credentials.pdf',
                        uploadedAt: new Date('2024-05-01'),
                        verified: true
                    }
                ],
                createdAt: new Date('2024-04-20'),
                updatedAt: new Date('2024-12-03'),
                verifiedAt: new Date('2024-05-05'),
                rating: 4.9,
                completedProjects: 76,
                availabilityStatus: 'busy'
            }
        ];

        // Initialize chat conversations
        this.chatConversations = [
            {
                id: 'chat1',
                individualId: '1',
                individualName: 'Michael Johnson',
                lastMessage: {
                    id: 'msg1',
                    senderId: 'admin',
                    senderName: 'Admin',
                    senderType: 'admin',
                    message: 'Can you provide your updated availability for next week?',
                    timestamp: new Date('2024-12-06T09:15:00'),
                    read: false
                },
                unreadCount: 1,
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-12-06T09:15:00')
            },
            {
                id: 'chat2',
                individualId: '2',
                individualName: 'Emily Davis',
                lastMessage: {
                    id: 'msg2',
                    senderId: 'emily',
                    senderName: 'Emily Davis',
                    senderType: 'individual',
                    message: 'I\'ve completed the design mockups as requested.',
                    timestamp: new Date('2024-12-05T14:20:00'),
                    read: true
                },
                unreadCount: 0,
                createdAt: new Date('2024-10-15'),
                updatedAt: new Date('2024-12-05T14:20:00')
            }
        ];

        this.loadIndividualProfiles();
    }

    loadIndividualProfiles(): void {
        this.loading = true;

        // Simulate API delay
        setTimeout(() => {
            let filteredProfiles = [...this.individualProfiles];

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

            if (this.selectedAvailabilityStatus && this.selectedAvailabilityStatus !== 'null') {
                filteredProfiles = filteredProfiles.filter(profile =>
                    profile.availabilityStatus === this.selectedAvailabilityStatus
                );
            }

            if (this.globalFilterValue) {
                const searchTerm = this.globalFilterValue.toLowerCase();
                filteredProfiles = filteredProfiles.filter(profile =>
                    this.getFullName(profile).toLowerCase().includes(searchTerm) ||
                    profile.email.toLowerCase().includes(searchTerm) ||
                    profile.occupation.toLowerCase().includes(searchTerm) ||
                    profile.city.toLowerCase().includes(searchTerm) ||
                    profile.skills.some(skill => skill.toLowerCase().includes(searchTerm))
                );
            }

            // Apply pagination
            this.totalRecords = filteredProfiles.length;
            const startIndex = this.first;
            const endIndex = startIndex + this.rows;
            this.individualProfiles = filteredProfiles.slice(startIndex, endIndex);

            this.loading = false;
        }, 500);
    }

    loadStats(): void {
        // Calculate stats from dummy data
        const allProfiles = [
            { id: '1', verificationStatus: 'verified', isActive: true, availabilityStatus: 'available' },
            { id: '2', verificationStatus: 'verified', isActive: true, availabilityStatus: 'available' },
            { id: '3', verificationStatus: 'pending', isActive: true, availabilityStatus: 'available' },
            { id: '4', verificationStatus: 'verified', isActive: false, availabilityStatus: 'busy' },
            { id: '5', verificationStatus: 'rejected', isActive: false, availabilityStatus: 'unavailable' },
            { id: '6', verificationStatus: 'verified', isActive: true, availabilityStatus: 'available' },
            { id: '7', verificationStatus: 'verified', isActive: true, availabilityStatus: 'busy' }
        ];

        this.stats = {
            totalIndividuals: allProfiles.length,
            activeIndividuals: allProfiles.filter(p => p.isActive).length,
            pendingVerifications: allProfiles.filter(p => p.verificationStatus === 'pending').length,
            verifiedIndividuals: allProfiles.filter(p => p.verificationStatus === 'verified').length,
            rejectedIndividuals: allProfiles.filter(p => p.verificationStatus === 'rejected').length,
            availableIndividuals: allProfiles.filter(p => p.availabilityStatus === 'available').length
        };
    }

    loadChatConversations(): void {
        this.individualProfileService.getChatConversations()
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
        this.loadIndividualProfiles();
    }

    onGlobalFilter(table: Table, event: Event): void {
        this.globalFilterValue = (event.target as HTMLInputElement).value;
        this.first = 0; // Reset to first page when filtering
        this.loadIndividualProfiles();
    }

    onVerificationStatusFilter(event: any): void {
        this.selectedVerificationStatus = event.value;
        this.first = 0;
        this.loadIndividualProfiles();
    }

    onActiveStatusFilter(event: any): void {
        this.selectedActiveStatus = event.value;
        this.first = 0;
        this.loadIndividualProfiles();
    }

    onAvailabilityStatusFilter(event: any): void {
        this.selectedAvailabilityStatus = event.value;
        this.first = 0;
        this.loadIndividualProfiles();
    }

    viewProfileDetails(profile: IndividualProfile): void {
        this.selectedProfile = profile;
        this.viewMode = { list: false, detail: true, chat: false };
    }

    openChat(profile: IndividualProfile): void {
        this.selectedProfile = profile;
        this.loadChatMessages(profile.id);
        this.viewMode = { list: false, detail: false, chat: true };
    }

    loadChatMessages(individualId: string): void {
        this.chatLoading = true;
        this.individualProfileService.getChatMessages(individualId)
            .pipe(finalize(() => this.chatLoading = false))
            .subscribe({
                next: (messages) => {
                    this.chatMessages = messages;
                    this.markMessagesAsRead(individualId);
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

    markMessagesAsRead(individualId: string): void {
        this.individualProfileService.markMessagesAsRead(individualId)
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
        this.individualProfileService.sendChatMessage(
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

    deactivateProfile(profile: IndividualProfile): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to deactivate ${profile.firstName} ${profile.lastName}?`,
            header: 'Confirm Deactivation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.individualProfileService.deactivateIndividualProfile(profile.id, 'Deactivated by admin')
                    .subscribe({
                        next: () => {
                            profile.isActive = false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Individual profile deactivated successfully'
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

    activateProfile(profile: IndividualProfile): void {
        this.individualProfileService.activateIndividualProfile(profile.id)
            .subscribe({
                next: () => {
                    profile.isActive = true;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Individual profile activated successfully'
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

    getAvailabilityStatusColor(status: string): string {
        const colorMap: { [key: string]: string } = {
            'available': '#28a745',
            'busy': '#ffc107',
            'unavailable': '#dc3545'
        };
        return colorMap[status] || '#6c757d';
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getFullName(profile: IndividualProfile): string {
        return `${profile.firstName} ${profile.lastName}`;
    }

    getAge(dateOfBirth: Date): number {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }
}


