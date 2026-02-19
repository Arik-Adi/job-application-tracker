import { Component, computed, inject, signal } from '@angular/core';
import { JobStore } from '../../store/job.store';
import { Job } from '../../models/job.model';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { AddJobDialogComponent } from '../add-job-dialog/add-job-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

type SortDirection = 'asc' | 'desc' | '';
type SortColumn = 'company' | 'role' | 'status' | 'dateApplied' | 'salaryRange' | '';

@Component({
    selector: 'app-jobs-grid',
    standalone: true,
    imports: [CommonModule, TranslatePipe, PageHeaderComponent, ButtonComponent],
    providers: [DatePipe, CurrencyPipe],
    templateUrl: './jobs-grid.component.html',
    styleUrl: './jobs-grid.component.css'
})
export class JobsGridComponent {
    readonly store = inject(JobStore);
    readonly dialog = inject(Dialog);

    // State
    searchQuery = signal('');
    searchField = signal<string>('all');
    sortColumn = signal<SortColumn>('');
    sortDirection = signal<SortDirection>('');

    readonly filterOptions = [
        { key: 'all', label: 'All' },
        { key: 'company', label: 'Company' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
        { key: 'salaryRange', label: 'Salary' }
    ];

    onAddApplication() {
        const dialogRef = this.dialog.open<Job>(AddJobDialogComponent, {
            width: '500px',
            disableClose: true,
            panelClass: 'bg-transparent' // We handle styling in the component
        });

        dialogRef.closed.subscribe(result => {
            if (result) {
                // Generate a random ID for now since backend is mocked
                const newJob = {
                    ...result,
                    id: crypto.randomUUID(),
                    matchScore: 0,
                    techStack: [],
                    location: 'Remote' // Default for now
                } as Job;

                this.store.addJob(newJob);
            }
        });
    }

    onEditApplication(job: Job) {
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

    onDeleteApplication(id: string) {
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

    // Computed View Model
    filteredJobs = computed(() => {
        const jobs = this.store.jobs();
        const query = this.searchQuery().toLowerCase();
        const col = this.sortColumn();
        const dir = this.sortDirection();
        const field = this.searchField();

        // 1. Filter
        let result = jobs;
        if (query) {
            result = result.filter(job => {
                if (field === 'all') {
                    return job.company.toLowerCase().includes(query) ||
                        job.role.toLowerCase().includes(query) ||
                        job.status.toLowerCase().includes(query) ||
                        (job.salaryRange && job.salaryRange.toLowerCase().includes(query));
                } else if (field === 'company') {
                    return job.company.toLowerCase().includes(query);
                } else if (field === 'role') {
                    return job.role.toLowerCase().includes(query);
                } else if (field === 'status') {
                    return job.status.toLowerCase().includes(query);
                } else if (field === 'salaryRange') {
                    return job.salaryRange && job.salaryRange.toLowerCase().includes(query);
                }
                return false;
            });
        }

        // 2. Sort
        if (col && dir) {
            result = [...result].sort((a, b) => {
                const valA = a[col] || '';
                const valB = b[col] || '';

                if (valA < valB) return dir === 'asc' ? -1 : 1;
                if (valA > valB) return dir === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    });

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchQuery.set(target.value);
    }

    setSearchField(field: string) {
        this.searchField.set(field);
    }

    toggleSort(column: SortColumn) {
        if (this.sortColumn() === column) {
            // cycle: asc -> desc -> off
            const currentDir = this.sortDirection();
            if (currentDir === 'asc') {
                this.sortDirection.set('desc');
            } else if (currentDir === 'desc') {
                this.sortDirection.set('');
                this.sortColumn.set('');
            } else {
                this.sortDirection.set('asc');
            }
        } else {
            this.sortColumn.set(column);
            this.sortDirection.set('asc');
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'Offer': return 'text-green-400 bg-green-400/10 px-2 py-1 rounded-md';
            case 'Rejected': return 'text-red-400 bg-red-400/10 px-2 py-1 rounded-md';
            case 'Interviewing': return 'text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md';
            case 'Applied': return 'text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md';
            default: return 'text-slate-400';
        }
    }
}
