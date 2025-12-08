import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export type DataType = 'string' | 'number' | 'boolean' | 'json' | 'date' | 'array';

export interface GlobalSetting {
    id: string;
    variableName: string;
    dataType: DataType;
    value: any;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}

export interface CreateSettingRequest {
    variableName: string;
    dataType: DataType;
    value: any;
    description?: string;
}

export interface UpdateSettingRequest {
    id: string;
    variableName?: string;
    dataType?: DataType;
    value?: any;
    description?: string;
    isActive?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class GlobalSettingsService {
    private apiUrl = '/api/global-settings';

    // Local storage for demo purposes - in production, this would be API calls
    private settingsSubject = new BehaviorSubject<GlobalSetting[]>([]);
    public settings$ = this.settingsSubject.asObservable();

    private dataTypes: { label: string; value: DataType; description: string }[] = [
        { label: 'String', value: 'string', description: 'Text values' },
        { label: 'Number', value: 'number', description: 'Numeric values' },
        { label: 'Boolean', value: 'boolean', description: 'True/False values' },
        { label: 'JSON', value: 'json', description: 'JSON object/array' },
        { label: 'Date', value: 'date', description: 'Date values' },
        { label: 'Array', value: 'array', description: 'Array of values' }
    ];

    constructor(private http: HttpClient) {
        this.loadInitialSettings();
    }

    getDataTypes() {
        return this.dataTypes;
    }

    // Get all global settings
    getSettings(): Observable<GlobalSetting[]> {
        // For demo purposes, return local data
        return this.settings$.pipe(
            map(settings => settings.map(setting => ({
                ...setting,
                createdAt: new Date(setting.createdAt),
                updatedAt: new Date(setting.updatedAt)
            })))
        );
    }

    // Get setting by ID
    getSettingById(id: string): Observable<GlobalSetting | undefined> {
        return this.settings$.pipe(
            map(settings => settings.find(s => s.id === id)),
            map(setting => setting ? {
                ...setting,
                createdAt: new Date(setting.createdAt),
                updatedAt: new Date(setting.updatedAt)
            } : undefined)
        );
    }

    // Create new setting
    createSetting(request: CreateSettingRequest): Observable<GlobalSetting> {
        const newSetting: GlobalSetting = {
            id: this.generateId(),
            variableName: request.variableName,
            dataType: request.dataType,
            value: this.validateAndParseValue(request.value, request.dataType),
            description: request.description,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'admin',
            updatedBy: 'admin'
        };

        const currentSettings = this.settingsSubject.value;
        this.settingsSubject.next([...currentSettings, newSetting]);

        return new Observable(observer => {
            observer.next(newSetting);
            observer.complete();
        });
    }

    // Update existing setting
    updateSetting(request: UpdateSettingRequest): Observable<GlobalSetting> {
        const currentSettings = this.settingsSubject.value;
        const settingIndex = currentSettings.findIndex(s => s.id === request.id);

        if (settingIndex === -1) {
            return throwError(() => new Error('Setting not found'));
        }

        const updatedSetting: GlobalSetting = {
            ...currentSettings[settingIndex],
            ...request,
            value: request.value !== undefined ?
                this.validateAndParseValue(request.value, request.dataType || currentSettings[settingIndex].dataType) :
                currentSettings[settingIndex].value,
            updatedAt: new Date(),
            updatedBy: 'admin'
        };

        const newSettings = [...currentSettings];
        newSettings[settingIndex] = updatedSetting;
        this.settingsSubject.next(newSettings);

        return new Observable(observer => {
            observer.next(updatedSetting);
            observer.complete();
        });
    }

    // Delete setting
    deleteSetting(id: string): Observable<void> {
        const currentSettings = this.settingsSubject.value;
        const filteredSettings = currentSettings.filter(s => s.id !== id);
        this.settingsSubject.next(filteredSettings);

        return new Observable(observer => {
            observer.next();
            observer.complete();
        });
    }

    // Toggle setting active status
    toggleSettingStatus(id: string): Observable<GlobalSetting> {
        const currentSettings = this.settingsSubject.value;
        const setting = currentSettings.find(s => s.id === id);

        if (!setting) {
            return throwError(() => new Error('Setting not found'));
        }

        return this.updateSetting({
            id,
            isActive: !setting.isActive
        });
    }

    // Validate and parse value based on data type
    private validateAndParseValue(value: any, dataType: DataType): any {
        if (value === null || value === undefined || value === '') {
            return this.getDefaultValue(dataType);
        }

        switch (dataType) {
            case 'string':
                return String(value);

            case 'number':
                const num = Number(value);
                if (isNaN(num)) {
                    throw new Error('Invalid number value');
                }
                return num;

            case 'boolean':
                if (typeof value === 'boolean') return value;
                if (typeof value === 'string') {
                    return value.toLowerCase() === 'true';
                }
                return Boolean(value);

            case 'json':
                if (typeof value === 'string') {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        throw new Error('Invalid JSON format');
                    }
                }
                return value;

            case 'date':
                if (value instanceof Date) return value;
                if (typeof value === 'string') {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                        throw new Error('Invalid date format');
                    }
                    return date;
                }
                throw new Error('Invalid date value');

            case 'array':
                if (Array.isArray(value)) return value;
                if (typeof value === 'string') {
                    try {
                        const parsed = JSON.parse(value);
                        if (Array.isArray(parsed)) return parsed;
                        throw new Error('Value is not an array');
                    } catch (e) {
                        // Try comma-separated string
                        return value.split(',').map(item => item.trim());
                    }
                }
                throw new Error('Invalid array value');

            default:
                return value;
        }
    }

    private getDefaultValue(dataType: DataType): any {
        switch (dataType) {
            case 'string': return '';
            case 'number': return 0;
            case 'boolean': return false;
            case 'json': return {};
            case 'date': return new Date();
            case 'array': return [];
            default: return null;
        }
    }

    private generateId(): string {
        return 'setting_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Load some initial demo settings
    private loadInitialSettings(): void {
        const initialSettings: GlobalSetting[] = [
            {
                id: 'setting_1',
                variableName: 'APP_NAME',
                dataType: 'string',
                value: 'BeauroWeb Admin',
                description: 'Application name displayed in the header',
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
                createdBy: 'system',
                updatedBy: 'system'
            },
            {
                id: 'setting_2',
                variableName: 'MAX_FILE_SIZE',
                dataType: 'number',
                value: 10485760,
                description: 'Maximum file upload size in bytes (10MB)',
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
                createdBy: 'system',
                updatedBy: 'system'
            },
            {
                id: 'setting_3',
                variableName: 'ENABLE_NOTIFICATIONS',
                dataType: 'boolean',
                value: true,
                description: 'Enable email notifications system-wide',
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
                createdBy: 'system',
                updatedBy: 'system'
            },
            {
                id: 'setting_4',
                variableName: 'SUPPORTED_LANGUAGES',
                dataType: 'array',
                value: ['en', 'es', 'fr', 'de'],
                description: 'List of supported languages in the application',
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
                createdBy: 'system',
                updatedBy: 'system'
            },
            {
                id: 'setting_5',
                variableName: 'MAINTENANCE_MODE',
                dataType: 'boolean',
                value: false,
                description: 'Enable maintenance mode for the application',
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
                createdBy: 'system',
                updatedBy: 'system'
            }
        ];

        this.settingsSubject.next(initialSettings);
    }

    // Format value for display
    formatValueForDisplay(value: any, dataType: DataType): string {
        if (value === null || value === undefined) {
            return 'Not set';
        }

        switch (dataType) {
            case 'string':
                return value || 'Empty string';

            case 'number':
                return value.toString();

            case 'boolean':
                return value ? 'True' : 'False';

            case 'json':
                return JSON.stringify(value, null, 2);

            case 'date':
                return value instanceof Date ? value.toLocaleDateString() : new Date(value).toLocaleDateString();

            case 'array':
                return Array.isArray(value) ? value.join(', ') : String(value);

            default:
                return String(value);
        }
    }

    // Get input type for form based on data type
    getInputTypeForDataType(dataType: DataType): string {
        switch (dataType) {
            case 'string':
                return 'text';
            case 'number':
                return 'number';
            case 'boolean':
                return 'checkbox';
            case 'date':
                return 'date';
            default:
                return 'text';
        }
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
                        errorMessage = 'Setting not found';
                        break;
                    case 409:
                        errorMessage = 'Setting already exists';
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

        console.error('GlobalSettingsService Error:', error);
        return throwError(() => new Error(errorMessage));
    }
}
