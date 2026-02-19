import { Component, inject } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { JobStore } from '../../store/job.store';
import { Job, JobStatus } from '../../models/job.model';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe, NgClass } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { Dialog } from '@angular/cdk/dialog';
import { AddJobDialogComponent } from '../add-job-dialog/add-job-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-pipeline',
    standalone: true,
    imports: [DragDropModule, TranslatePipe, DatePipe, NgClass, PageHeaderComponent],
    templateUrl: './pipeline.component.html',
    styleUrl: './pipeline.component.css'
})
export class PipelineComponent {
    readonly store = inject(JobStore);
    readonly dialog = inject(Dialog);

    // Define Kanban lanes
    lanes: { status: JobStatus, title: string, color: string }[] = [
        { status: 'Wishlist', title: 'Wishlist', color: 'bg-slate-700' },
        { status: 'Applied', title: 'Applied', color: 'bg-amber-500/10 border-amber-500/20' },
        { status: 'Interviewing', title: 'Interviewing', color: 'bg-blue-500/10 border-blue-500/20' },
        { status: 'Offer', title: 'Offer', color: 'bg-green-500/10 border-green-500/20' },
        { status: 'Rejected', title: 'Rejected', color: 'bg-red-500/10 border-red-500/20' },
    ];

    // Helper to get jobs for a specific status
    getJobsByStatus(status: JobStatus): Job[] {
        return this.store.jobs().filter(job => job.status === status);
    }

    onEdit(job: Job) {
        const dialogRef = this.dialog.open<Job>(AddJobDialogComponent, {
            width: '500px',
            disableClose: true,
            panelClass: 'bg-transparent',
            data: { job }
        });

        dialogRef.closed.subscribe(result => {
            if (result) {
                this.store.updateJob(result);
            }
        });
    }

    onDelete(id: string, event: Event) {
        event.stopPropagation();
        const dialogRef = this.dialog.open<boolean>(ConfirmationDialogComponent, {
            width: '400px',
            panelClass: 'bg-transparent',
            disableClose: true,
            data: {
                title: 'Delete Application',
                message: 'Are you sure you want to delete this application? This action cannot be undone.',
                isDestructive: true
            }
        });

        dialogRef.closed.subscribe(confirmed => {
            if (confirmed) {
                this.store.deleteJob(id);
            }
        });
    }

    drop(event: CdkDragDrop<JobStatus>) {
        // Current limitation: Since our store is a single array signal, we can't easily use transferArrayItem explicitly on the source/target arrays if they are derived.
        // Instead, we catch the drop event and update the job's status in the store.

        if (event.previousContainer === event.container) {
            // Reordering within the same list (not implemented in store yet, so just visual for now or ignored)
            return;
        } else {
            // Moving to a new lane
            const job = event.item.data as Job;
            const newStatus = event.container.id as JobStatus;

            this.store.updateStatus(job.id, newStatus);
        }
    }
}
