import { Component, computed, inject, signal } from '@angular/core';
import { JobStore } from '../../store/job.store';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

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

    // State
    searchQuery = signal('');
    sortColumn = signal<SortColumn>('');
    sortDirection = signal<SortDirection>('');

    // Computed View Model
    filteredJobs = computed(() => {
        const jobs = this.store.jobs();
        const query = this.searchQuery().toLowerCase();
        const col = this.sortColumn();
        const dir = this.sortDirection();

        // 1. Filter
        let result = jobs;
        if (query) {
            result = result.filter(job =>
                job.company.toLowerCase().includes(query) ||
                job.role.toLowerCase().includes(query) ||
                job.status.toLowerCase().includes(query)
            );
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
