import { Component, inject } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { JobStore } from '../../store/job.store';
import { Job, JobStatus } from '../../models/job.model';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe, NgClass } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
    selector: 'app-pipeline',
    standalone: true,
    imports: [DragDropModule, TranslatePipe, DatePipe, NgClass, PageHeaderComponent],
    templateUrl: './pipeline.component.html',
    styleUrl: './pipeline.component.css'
})
export class PipelineComponent {
    readonly store = inject(JobStore);

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
