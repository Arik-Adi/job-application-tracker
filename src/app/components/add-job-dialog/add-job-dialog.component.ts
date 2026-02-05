import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Job } from '../../models/job.model';

@Component({
    selector: 'app-add-job-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe, ButtonComponent],
    templateUrl: './add-job-dialog.component.html',
})
export class AddJobDialogComponent {
    form: FormGroup;
    selectedFile = signal<File | null>(null);

    statusOptions = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

    constructor(
        private fb: FormBuilder,
        public dialogRef: DialogRef<Partial<Job>>,
        @Inject(DIALOG_DATA) public data: any
    ) {
        this.form = this.fb.group({
            company: ['', Validators.required],
            role: ['', Validators.required],
            status: ['Wishlist', Validators.required],
            salaryRange: [''],
            location: [''],
            description: [''],
            url: ['', [Validators.pattern('https?://.+')]]
        });
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedFile.set(input.files[0]);
        }
    }

    onSubmit() {
        if (this.form.valid) {
            const formValue = this.form.value;
            const newJob: Partial<Job> = {
                ...formValue,
                // In a real app, we would upload the file here and get a URL back
                // For now, we can perhaps store the file name or a mock URL if needed, 
                // or pass the file object back to the container to handle.
                // Let's assume we just pass back the form data for now.
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // We could attach the file to the result if needed
            this.dialogRef.close(newJob);
        } else {
            this.form.markAllAsTouched();
        }
    }

    close() {
        this.dialogRef.close();
    }
}
