import { Component, Inject, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Job } from '../../models/job.model';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-add-job-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe, ButtonComponent],
    templateUrl: './add-job-dialog.component.html',
})
export class AddJobDialogComponent {
    private storage = inject(Storage);
    private auth = inject(AuthService);

    form: FormGroup;
    selectedFile = signal<File | null>(null);
    maxDate = new Date().toISOString().split('T')[0];
    isEditMode = false;
    isUploading = signal(false);

    statusOptions = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

    constructor(
        private fb: FormBuilder,
        public dialogRef: DialogRef<Partial<Job>>,
        @Inject(DIALOG_DATA) public data: { job?: Job }
    ) {
        this.isEditMode = !!data?.job;

        this.form = this.fb.group({
            company: [data?.job?.company || '', Validators.required],
            role: [data?.job?.role || '', Validators.required],
            status: [data?.job?.status || 'Wishlist', Validators.required],
            dateApplied: [data?.job?.dateApplied ? new Date(data.job.dateApplied).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], Validators.required],
            salaryRange: [data?.job?.salaryRange || ''],
            location: [data?.job?.location || ''],
            recruitingContact: [data?.job?.recruitingContact || ''],
            comments: [data?.job?.comments || ''],
            description: [data?.job?.description || ''],
            url: [data?.job?.url || '', [Validators.pattern('https?://.+')]],
            glassdoorUrl: [data?.job?.glassdoorUrl || '', [Validators.pattern('https?://.+')]]
        });
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedFile.set(input.files[0]);
        }
    }

    async onSubmit() {
        if (this.form.valid) {
            this.isUploading.set(true);
            const formValue = this.form.value;

            const jobData: Partial<Job> = {
                ...formValue,
                dateApplied: formValue.dateApplied ? new Date(formValue.dateApplied) : new Date(),
                updatedAt: new Date()
            };

            try {
                // Handle File Upload
                let cvUrl = this.data?.job?.documents?.cvUrl || '';

                if (this.selectedFile()) {
                    const user = this.auth.user();
                    if (user) {
                        const file = this.selectedFile()!;
                        const path = `users/${user.uid}/resumes/${Date.now()}_${file.name}`;
                        const storageRef = ref(this.storage, path);
                        const result = await uploadBytes(storageRef, file);
                        cvUrl = await getDownloadURL(result.ref);
                    }
                }

                if (cvUrl) {
                    jobData.documents = {
                        cvUrl,
                        coverLetterUrl: ''
                    };
                }

                if (this.isEditMode && this.data.job) {
                    this.dialogRef.close({
                        ...this.data.job,
                        ...jobData
                    });
                } else {
                    this.dialogRef.close({
                        ...jobData,
                        createdAt: new Date()
                    });
                }
            } catch (err) {
                console.error('Upload failed', err);
            } finally {
                this.isUploading.set(false);
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    get isGuest(): boolean {
        return !this.auth.user();
    }

    close() {
        this.dialogRef.close();
    }
}
