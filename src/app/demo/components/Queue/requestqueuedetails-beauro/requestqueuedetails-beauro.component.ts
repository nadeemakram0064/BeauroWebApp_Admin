import { Component, OnInit } from '@angular/core';
import { RequestService, RequestDetails } from '../../../service/request.service';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

interface Document {
    name: string;
    status: string;
    date: string;
}

interface Service {
    name: string;
    icon: string;
    color: string;
    description?: string;
    features?: string[];
    price?: string;
    duration?: string;
    rating?: number;
    reviews?: number;
    selected?: boolean;
    provided?: boolean;
}

interface Review {
    id?: number;
    customer: string;
    rating: number;
    comment: string;
    date: string;
    verified?: boolean;
    helpful?: number;
    service?: string;
    bureauReply?: {
        text: string;
        date: string;
    };
}

interface VerificationStep {
    status: string;
    description: string;
    date: string;
    time: string;
    verifiedBy: string;
}

interface ChatMessage {
    sender: 'admin' | 'bureau';
    text: string;
    time: string;
}

@Component({
    selector: 'app-requestqueuedetails-beauro',
    templateUrl: './requestqueuedetails-beauro.component.html',
    styleUrls: ['./requestqueuedetails-beauro.component.scss'],
    providers: [MessageService]
})
export class RequestqueuedetailsBeauroComponent implements OnInit {

    requestDetails: RequestDetails | null = null;
    requestId: string | null = null;
    requestType: string | null = null;

    rating: number = 4.8;

    documents: Document[] = [];
    marriageServices: Service[] = [];
    additionalServices: Service[] = [];
    reviews: Review[] = [];
    verificationHistory: VerificationStep[] = [];
    chatMessages: ChatMessage[] = [];
    newMessage: string = '';

    ratingBreakdown: { stars: number; percentage: number; count: number }[] = [];
    reviewFilters: any[] = [];
    selectedFilter: any = null;
    filteredReviews: Review[] = [];
    hasMoreReviews: boolean = true;

    items: MenuItem[] = [];
    cardMenu: MenuItem[] = [];

    constructor(private requestService: RequestService, private messageService: MessageService) { }

    onFilterChange() {
        this.applyFilter();
    }

    ngOnInit(): void {
        this.requestDetails = this.requestService.getSelectedRequest();
        this.requestId = this.requestDetails?.id || null;
        this.requestType = this.requestDetails?.type || null;

        console.log('Beauro Request details received from service:', this.requestDetails);

        // Initialize data for the tabs
        this.documents = [
            { name: 'Business License', status: 'Verified', date: '2023-01-01' },
            { name: 'GST Certificate', status: 'Verified', date: '2023-01-05' },
            { name: 'PAN Card', status: 'Verified', date: '2023-01-10' },
            { name: 'Marriage Bureau License', status: 'Verified', date: '2023-01-15' }
        ];

        this.marriageServices = [
            {
                name: 'Hindu Marriage',
                icon: 'pi pi-heart',
                color: '#ef4444',
                description: 'Traditional Hindu marriage ceremonies with all rituals and customs',
                features: ['Puja', 'Haldi', 'Mehndi', 'Reception'],
                price: '₹50,000',
                duration: '2-3 Days',
                selected: false,
                provided: true
            },
            {
                name: 'Christian Marriage',
                icon: 'pi pi-cross',
                color: '#22c55e',
                description: 'Beautiful Christian wedding ceremonies in churches',
                features: ['Church Ceremony', 'Reception', 'Photography'],
                price: '₹45,000',
                duration: '1-2 Days',
                selected: false,
                provided: true
            },
            {
                name: 'Muslim Marriage',
                icon: 'pi pi-moon',
                color: '#3b82f6',
                description: 'Islamic marriage ceremonies following Islamic traditions',
                features: ['Nikah', 'Walima', 'Reception'],
                price: '₹40,000',
                duration: '1-2 Days',
                selected: false,
                provided: true
            },
            {
                name: 'Inter-caste Marriage',
                icon: 'pi pi-users',
                color: '#f97316',
                description: 'Support for inter-caste marriages with family counseling',
                features: ['Counseling', 'Ceremony', 'Documentation'],
                price: '₹55,000',
                duration: '2-3 Days',
                selected: false,
                provided: true
            },
            {
                name: 'Love Marriages',
                icon: 'pi pi-sparkles',
                color: '#ec4899',
                description: 'Romantic love marriage ceremonies with modern touches',
                features: ['Custom Ceremony', 'Photography', 'Destination Wedding'],
                price: '₹60,000',
                duration: '1-3 Days',
                selected: false,
                provided: true
            }
        ];

        this.additionalServices = [
            {
                name: 'Wedding Planning',
                icon: 'pi pi-calendar',
                color: '#8b5cf6',
                description: 'Complete wedding planning and coordination services',
                rating: 4.9,
                reviews: 245,
                price: '₹25,000',
                selected: false,
                provided: true
            },
            {
                name: 'Photography',
                icon: 'pi pi-camera',
                color: '#14b8a6',
                description: 'Professional wedding photography and videography',
                rating: 4.8,
                reviews: 189,
                price: '₹30,000',
                selected: false,
                provided: true
            },
            {
                name: 'Catering',
                icon: 'pi pi-shopping-cart',
                color: '#f59e0b',
                description: 'Delicious catering services for all dietary preferences',
                rating: 4.7,
                reviews: 156,
                price: '₹35,000',
                selected: false,
                provided: true
            },
            {
                name: 'Venue Booking',
                icon: 'pi pi-map-marker',
                color: '#6366f1',
                description: 'Prime venue booking and decoration services',
                rating: 4.6,
                reviews: 134,
                price: '₹40,000',
                selected: false,
                provided: true
            }
        ];

        this.reviews = [
            {
                id: 1,
                customer: 'Priya Sharma',
                rating: 5,
                comment: 'Excellent service from Happy Marriages Bureau! They helped us find the perfect match within 6 months. The counselors were very professional and supportive throughout the entire process. Highly recommended!',
                date: '2023-10-20',
                verified: true,
                helpful: 12,
                service: 'Hindu Marriage',
                bureauReply: {
                    text: 'Thank you for your kind words, Priya! We\'re delighted to hear about your successful journey with us.',
                    date: '2023-10-21'
                }
            },
            {
                id: 2,
                customer: 'Rahul Verma',
                rating: 4,
                comment: 'Good experience overall. The team was responsive and helped us understand the matchmaking process. Found a great match through their network.',
                date: '2023-09-15',
                verified: true,
                helpful: 8,
                service: 'Matchmaking Services'
            },
            {
                id: 3,
                customer: 'Anjali Singh',
                rating: 5,
                comment: 'Outstanding service! The bureau went above and beyond to ensure we had a perfect wedding. Their attention to detail and personalized approach made all the difference.',
                date: '2023-08-01',
                verified: true,
                helpful: 15,
                service: 'Complete Wedding Package',
                bureauReply: {
                    text: 'Thank you for choosing us for your special day, Anjali! It was a pleasure working with you.',
                    date: '2023-08-02'
                }
            },
            {
                id: 4,
                customer: 'Vikram Patel',
                rating: 5,
                comment: 'Professional team with deep knowledge of cultural traditions. They respected our family values while finding suitable matches. Very satisfied with the outcome.',
                date: '2023-07-18',
                verified: true,
                helpful: 6,
                service: 'Traditional Matchmaking'
            },
            {
                id: 5,
                customer: 'Sneha Reddy',
                rating: 4,
                comment: 'Great platform for finding life partners. The verification process gave us confidence. Would recommend to friends and family.',
                date: '2023-06-30',
                verified: true,
                helpful: 9,
                service: 'Profile Verification'
            }
        ];

        // Initialize rating breakdown
        this.ratingBreakdown = [
            { stars: 5, percentage: 68, count: 174 },
            { stars: 4, percentage: 22, count: 56 },
            { stars: 3, percentage: 8, count: 20 },
            { stars: 2, percentage: 1, count: 3 },
            { stars: 1, percentage: 1, count: 3 }
        ];

        // Initialize review filters
        this.reviewFilters = [
            { label: 'All Reviews', value: null },
            { label: '5 Star Reviews', value: 5 },
            { label: '4 Star Reviews', value: 4 },
            { label: 'Verified Reviews', value: 'verified' },
            { label: 'With Replies', value: 'replied' }
        ];

        // Initialize filtered reviews
        this.filteredReviews = [...this.reviews];

        this.verificationHistory = [
            { status: 'Application Submitted', description: 'Bureau application received.', date: '2023-01-01', time: '10:00 AM', verifiedBy: 'System' },
            { status: 'Documents Verified', description: 'All submitted documents verified and approved.', date: '2023-01-05', time: '02:30 PM', verifiedBy: 'Admin User' },
            { status: 'Background Check Completed', description: 'Background check for owner and business completed.', date: '2023-01-10', time: '11:00 AM', verifiedBy: 'Verification Team' },
            { status: 'Final Approval', description: 'Marriage Bureau approved for onboarding.', date: '2023-01-12', time: '04:00 PM', verifiedBy: 'Manager' }
        ];

        // Initialize chat messages
        this.chatMessages = [
            { sender: 'bureau', text: 'Hello Admin, we have submitted our marriage bureau application. Please review it.', time: '10:30 AM' },
            { sender: 'admin', text: 'Thank you for your application. We have received all your documents and are reviewing them.', time: '11:15 AM' },
            { sender: 'bureau', text: 'Great! Is there any additional information needed from our side?', time: '11:45 AM' },
            { sender: 'admin', text: 'Your documents look complete. We are currently verifying your business license.', time: '2:20 PM' },
            { sender: 'bureau', text: 'Understood. Please let us know if you need any clarification.', time: '2:35 PM' },
            { sender: 'admin', text: 'Verification completed successfully. Your bureau will be approved shortly.', time: '4:10 PM' },
            { sender: 'bureau', text: 'Thank you for the update! We appreciate your prompt response.', time: '4:25 PM' }
        ];
    }

    // Action methods for buttons
    approveBureau() {
        this.messageService.add({ severity: 'success', summary: 'Approved', detail: `Bureau Request ${this.requestId} Approved!` });
        console.log(`Bureau Request ${this.requestId} Approved!`);
    }

    reviseBureau() {
        this.messageService.add({ severity: 'info', summary: 'Revision Needed', detail: `Bureau Request ${this.requestId} marked for Revision.` });
        console.log(`Bureau Request ${this.requestId} marked for Revision.`);
    }

    rejectBureau() {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Bureau Request ${this.requestId} Rejected.` });
        console.log(`Bureau Request ${this.requestId} Rejected.`);
    }

    viewDocument(fileName: string) {
        this.messageService.add({ severity: 'info', summary: 'View Document', detail: `Viewing ${fileName}` });
        console.log(`Viewing document: ${fileName}`);
        // Implement actual document viewing logic here
    }

    downloadDocument(fileName: string) {
        this.messageService.add({ severity: 'success', summary: 'Download Document', detail: `Downloading ${fileName}` });
        console.log(`Downloading document: ${fileName}`);
        // Implement actual document download logic here
    }

    sendMessage() {
        if (this.newMessage && this.newMessage.trim()) {
            const message: ChatMessage = {
                sender: 'admin',
                text: this.newMessage.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            this.chatMessages.push(message);
            this.newMessage = '';

            // Auto-scroll to bottom (simulate bureau response after a delay)
            setTimeout(() => {
                const bureauReply: ChatMessage = {
                    sender: 'bureau',
                    text: 'Thank you for your message. We will respond shortly.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                this.chatMessages.push(bureauReply);
            }, 2000);
        }
    }

    toggleService(service: Service) {
        service.selected = !service.selected;
        this.messageService.add({
            severity: service.selected ? 'success' : 'info',
            summary: service.selected ? 'Service Selected' : 'Service Deselected',
            detail: `${service.name} has been ${service.selected ? 'selected' : 'deselected'}`
        });
    }

    bookService(service: Service) {
        this.messageService.add({
            severity: 'success',
            summary: 'Service Booked',
            detail: `${service.name} has been booked successfully!`
        });
    }

    markHelpful(review: Review) {
        if (review.helpful !== undefined) {
            review.helpful++;
        } else {
            review.helpful = 1;
        }
        this.messageService.add({
            severity: 'success',
            summary: 'Marked Helpful',
            detail: 'Thank you for your feedback!'
        });
    }

    showReply(review: Review) {
        this.messageService.add({
            severity: 'info',
            summary: 'Reply Feature',
            detail: 'Reply functionality will be available soon!'
        });
    }

    loadMoreReviews() {
        // Simulate loading more reviews
        const newReviews: Review[] = [
            {
                id: 6,
                customer: 'Amit Kumar',
                rating: 5,
                comment: 'Exceptional service! The bureau\'s dedication to finding the right match is commendable. Their follow-up and support made the entire process smooth.',
                date: '2023-06-15',
                verified: true,
                helpful: 4,
                service: 'Personalized Matchmaking'
            }
        ];

        this.reviews.push(...newReviews);
        this.applyFilter();
        this.hasMoreReviews = false; // For demo purposes

        this.messageService.add({
            severity: 'success',
            summary: 'Reviews Loaded',
            detail: 'More customer reviews have been loaded successfully!'
        });
    }

    getInitials(name: string): string {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    trackByReviewId(index: number, review: Review): number {
        return review.id || index;
    }

    applyFilter() {
        if (!this.selectedFilter) {
            this.filteredReviews = [...this.reviews];
        } else if (typeof this.selectedFilter === 'number') {
            // Filter by rating
            this.filteredReviews = this.reviews.filter(review => review.rating === this.selectedFilter);
        } else if (this.selectedFilter === 'verified') {
            this.filteredReviews = this.reviews.filter(review => review.verified);
        } else if (this.selectedFilter === 'replied') {
            this.filteredReviews = this.reviews.filter(review => review.bureauReply);
        }
    }

}

