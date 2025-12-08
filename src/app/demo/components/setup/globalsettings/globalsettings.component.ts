import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { GlobalSettingsService, GlobalSetting, DataType, CreateSettingRequest } from '../../../service/global-settings.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-globalsettings',
    templateUrl: './globalsettings.component.html',
    styleUrls: ['./globalsettings.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class GlobalsettingsComponent implements OnInit {

    // Form
    settingForm: FormGroup;
    isSubmitting: boolean = false;

    // Data
    settings: GlobalSetting[] = [];
    private _settings: GlobalSetting[] = [];
    dataTypes: { label: string; value: DataType; description: string }[] = [];

    // UI state
    loading: boolean = false;
    editingSetting: GlobalSetting | null = null;
    showAddForm: boolean = false;

    // Computed properties for template
    get selectedDataType(): DataType | null {
        return this.settingForm.get('dataType')?.value || null;
    }

    get inputType(): string {
        return this.selectedDataType ? this.getInputTypeForDataType(this.selectedDataType) : 'text';
    }

    get isTextArea(): boolean {
        return this.selectedDataType ? this.isTextAreaNeeded(this.selectedDataType) : false;
    }

    get placeholder(): string {
        return this.selectedDataType ? this.getPlaceholderForDataType(this.selectedDataType) : '';
    }

    get helpText(): string {
        return this.selectedDataType ? this.getHelpTextForDataType(this.selectedDataType) : '';
    }

    constructor(
        private fb: FormBuilder,
        private globalSettingsService: GlobalSettingsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.settingForm = this.fb.group({
            variableName: ['', [
                Validators.required,
                Validators.pattern(/^[A-Z][A-Z0-9_]*$/),
                this.variableNameValidator.bind(this)
            ]],
            dataType: ['', Validators.required],
            value: ['', Validators.required],
            description: ['']
        });
    }

    ngOnInit(): void {
        this.dataTypes = this.globalSettingsService.getDataTypes();
        this.loadSettings();

        // Watch for data type changes to update value validation
        this.settingForm.get('dataType')?.valueChanges.subscribe(dataType => {
            this.updateValueValidation(dataType);
        });
    }

    loadSettings(): void {
        this.loading = true;
        this.globalSettingsService.getSettings()
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: (settings) => {
                    this.settings = settings;
                    this._settings = [...settings];
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to load settings: ' + error.message
                    });
                }
            });
    }

    onSubmit(): void {
        if (this.settingForm.valid) {
            this.isSubmitting = true;

            const formValue = this.settingForm.value;
            const request: CreateSettingRequest = {
                variableName: formValue.variableName,
                dataType: formValue.dataType,
                value: formValue.value,
                description: formValue.description
            };

            this.globalSettingsService.createSetting(request)
                .pipe(finalize(() => this.isSubmitting = false))
                .subscribe({
                    next: (newSetting) => {
                        this.settings.unshift(newSetting);
                        this._settings = [...this.settings];
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Setting created successfully'
                        });
                        this.resetForm();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create setting: ' + error.message
                        });
                    }
                });
        } else {
            this.markFormGroupTouched(this.settingForm);
        }
    }

    editSetting(setting: GlobalSetting): void {
        this.editingSetting = setting;
        this.settingForm.patchValue({
            variableName: setting.variableName,
            dataType: setting.dataType,
            value: this.formatValueForForm(setting.value, setting.dataType),
            description: setting.description || ''
        });
        this.showAddForm = true;
    }

    updateSetting(): void {
        if (this.settingForm.valid && this.editingSetting) {
            this.isSubmitting = true;

            const formValue = this.settingForm.value;
            const request = {
                id: this.editingSetting.id,
                variableName: formValue.variableName,
                dataType: formValue.dataType,
                value: formValue.value,
                description: formValue.description
            };

            this.globalSettingsService.updateSetting(request)
                .pipe(finalize(() => this.isSubmitting = false))
                .subscribe({
                    next: (updatedSetting) => {
                        const index = this.settings.findIndex(s => s.id === updatedSetting.id);
                        if (index !== -1) {
                            this.settings[index] = updatedSetting;
                            this._settings = [...this.settings];
                        }
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Setting updated successfully'
                        });
                        this.cancelEdit();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update setting: ' + error.message
                        });
                    }
                });
        }
    }

    deleteSetting(setting: GlobalSetting): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete the setting "${setting.variableName}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.globalSettingsService.deleteSetting(setting.id)
                    .subscribe({
                        next: () => {
                            this.settings = this.settings.filter(s => s.id !== setting.id);
                        this._settings = [...this.settings];
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Setting deleted successfully'
                            });
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to delete setting: ' + error.message
                            });
                        }
                    });
            }
        });
    }

    toggleSettingStatus(setting: GlobalSetting): void {
        this.globalSettingsService.toggleSettingStatus(setting.id)
            .subscribe({
                next: (updatedSetting) => {
                    const index = this.settings.findIndex(s => s.id === updatedSetting.id);
                    if (index !== -1) {
                        this.settings[index] = updatedSetting;
                        this._settings = [...this.settings];
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Setting ${updatedSetting.isActive ? 'activated' : 'deactivated'} successfully`
                    });
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to toggle setting status: ' + error.message
                    });
                }
            });
    }

    resetForm(): void {
        this.settingForm.reset();
        this.editingSetting = null;
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

    // Custom validators
    variableNameValidator(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;

        const value = control.value.toUpperCase();

        // Check if variable name already exists (excluding current editing setting)
        const exists = this.settings.some(setting =>
            setting.variableName.toUpperCase() === value &&
            (!this.editingSetting || setting.id !== this.editingSetting.id)
        );

        return exists ? { variableNameExists: true } : null;
    }

    updateValueValidation(dataType: DataType): void {
        const valueControl = this.settingForm.get('value');
        if (!valueControl) return;

        // Clear existing validators
        valueControl.clearValidators();
        valueControl.setValidators([Validators.required]);

        // Add type-specific validation
        switch (dataType) {
            case 'number':
                valueControl.setValidators([Validators.required, Validators.pattern(/^-?\d*\.?\d+$/)]);
                break;
            case 'json':
                // JSON validation will be handled in the service
                break;
            case 'date':
                // Date validation will be handled by input type
                break;
        }

        valueControl.updateValueAndValidity();
    }

    formatValueForForm(value: any, dataType: DataType): string {
        if (value === null || value === undefined) return '';

        switch (dataType) {
            case 'boolean':
                return value.toString();
            case 'json':
            case 'array':
                return JSON.stringify(value);
            case 'date':
                return value instanceof Date ? value.toISOString().split('T')[0] : value;
            default:
                return String(value);
        }
    }

    formatValueForDisplay(value: any, dataType: DataType): string {
        return this.globalSettingsService.formatValueForDisplay(value, dataType);
    }

    getInputTypeForDataType(dataType: DataType): string {
        return this.globalSettingsService.getInputTypeForDataType(dataType);
    }

    isTextAreaNeeded(dataType: DataType): boolean {
        return dataType === 'json' || dataType === 'array';
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    getDataTypeLabel(dataType: DataType): string {
        const type = this.dataTypes.find(t => t.value === dataType);
        return type ? type.label : dataType;
    }

    getDataTypeColor(dataType: DataType): string {
        const colorMap: { [key in DataType]: string } = {
            'string': '#28a745',
            'number': '#007bff',
            'boolean': '#ffc107',
            'json': '#6f42c1',
            'date': '#17a2b8',
            'array': '#dc3545'
        };
        return colorMap[dataType] || '#6c757d';
    }

    getPlaceholderForDataType(dataType: DataType): string {
        switch (dataType) {
            case 'string': return 'Enter text value';
            case 'number': return 'Enter numeric value';
            case 'boolean': return 'True or False';
            case 'json': return '{"key": "value"}';
            case 'date': return 'Select date';
            case 'array': return '["item1", "item2"] or item1,item2';
            default: return 'Enter value';
        }
    }

    getHelpTextForDataType(dataType: DataType): string {
        switch (dataType) {
            case 'string': return 'Any text value';
            case 'number': return 'Numeric value (integer or decimal)';
            case 'boolean': return 'True or False value';
            case 'json': return 'Valid JSON object or array';
            case 'date': return 'Date in YYYY-MM-DD format';
            case 'array': return 'Comma-separated values or JSON array';
            default: return '';
        }
    }

    // Statistics methods for template
    getActiveSettingsCount(): number {
        return this._settings.filter(s => s.isActive).length;
    }

    getSystemSettingsCount(): number {
        return this._settings.filter(s => s.createdBy === 'system').length;
    }

    getCustomSettingsCount(): number {
        return this._settings.filter(s => s.createdBy !== 'system').length;
    }
}


