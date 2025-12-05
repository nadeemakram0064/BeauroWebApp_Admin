import { Component, OnInit } from '@angular/core';
import { RequestService, RequestDetails } from '../../../service/request.service';
import { MessageService } from 'primeng/api';

interface Document {
    name: string;
    status: string;
    date: string;
}

interface ChatMessage {
    sender: 'admin' | 'individual';
    text: string;
    time: string;
}

@Component({
    selector: 'app-requestqueuedetails-individual',
    templateUrl: './requestqueuedetails-individual.component.html',
    styleUrls: ['./requestqueuedetails-individual.component.scss'],
    providers: [MessageService]
})
export class RequestqueuedetailsIndividualComponent implements OnInit {

    requestDetails: RequestDetails | null = null;
    requestId: string | null = null;
    requestType: string | null = null;

    documents: Document[] = [];
    chatMessages: ChatMessage[] = [];
    newMessage: string = '';

    constructor(private requestService: RequestService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.requestDetails = this.requestService.getSelectedRequest();
        this.requestId = this.requestDetails?.id || null;
        this.requestType = this.requestDetails?.type || null;

        console.log('Individual Request details received from service:', this.requestDetails);

        // Initialize data for documents
        this.documents = [
            { name: 'ID Proof', status: 'Verified', date: '2023-01-01' },
            { name: 'Address Proof', status: 'Verified', date: '2023-01-05' },
            { name: 'Education Certificate', status: 'Verified', date: '2023-01-10' },
            { name: 'Income Certificate', status: 'Verified', date: '2023-01-15' }
        ];

        // Initialize chat messages
        this.chatMessages = [
            { sender: 'individual', text: 'Hello Admin, I have submitted my profile for verification.', time: '9:30 AM' },
            { sender: 'admin', text: 'Thank you for submitting your profile. We are reviewing your information.', time: '10:15 AM' },
            { sender: 'individual', text: 'Please let me know if any additional documents are required.', time: '10:45 AM' },
            { sender: 'admin', text: 'Your profile looks complete. Verification should be completed soon.', time: '2:30 PM' },
            { sender: 'individual', text: 'Great! I appreciate your prompt response.', time: '2:45 PM' }
        ];
    }

    // Action methods for buttons
    approveIndividual() {
        this.messageService.add({ severity: 'success', summary: 'Approved', detail: `Individual Request ${this.requestId} Approved!` });
        console.log(`Individual Request ${this.requestId} Approved!`);
    }

    reviseIndividual() {
        this.messageService.add({ severity: 'info', summary: 'Revision Needed', detail: `Individual Request ${this.requestId} marked for Revision.` });
        console.log(`Individual Request ${this.requestId} marked for Revision.`);
    }

    rejectIndividual() {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: `Individual Request ${this.requestId} Rejected.` });
        console.log(`Individual Request ${this.requestId} Rejected.`);
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

            // Auto-scroll to bottom (simulate individual response after a delay)
            setTimeout(() => {
                const individualReply: ChatMessage = {
                    sender: 'individual',
                    text: 'Thank you for your message. I will respond as soon as possible.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                this.chatMessages.push(individualReply);
            }, 2000);
        }
    }
}
