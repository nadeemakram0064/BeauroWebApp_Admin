import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RequestDetails {
    id: string;
    type: string;
}

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private selectedRequestSubject = new BehaviorSubject<RequestDetails | null>(null);
    selectedRequest$: Observable<RequestDetails | null> = this.selectedRequestSubject.asObservable();

    constructor() { }

    setSelectedRequest(id: string, type: string) {
        this.selectedRequestSubject.next({ id, type });
    }

    getSelectedRequest(): RequestDetails | null {
        return this.selectedRequestSubject.getValue();
    }

    clearSelectedRequest() {
        this.selectedRequestSubject.next(null);
    }
}

