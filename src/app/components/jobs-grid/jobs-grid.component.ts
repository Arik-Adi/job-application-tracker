import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { JobStore } from '../../store/job.store';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'app-jobs-grid',
    standalone: true,
    imports: [AgGridAngular, TranslatePipe, PageHeaderComponent, ButtonComponent],
    templateUrl: './jobs-grid.component.html',
    styleUrl: './jobs-grid.component.css'
})
export class JobsGridComponent {
    readonly store = inject(JobStore);

    // State for Quick Filter
    quickFilterText = '';

    // Column Definitions: Defines the columns to be displayed.
    colDefs: ColDef[] = [
        { field: 'company', headerName: 'Company', flex: 1 },
        { field: 'role', headerName: 'Role', flex: 1 },
        {
            field: 'status', headerName: 'Status', flex: 1,
            cellClassRules: {
                'text-green-400': params => params.value === 'Offer',
                'text-red-400': params => params.value === 'Rejected',
                'text-blue-400': params => params.value === 'Interviewing',
                'text-amber-400': params => params.value === 'Applied'
            }
        },
        { field: 'dateApplied', headerName: 'Date Applied', valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString() : '-' },
        { field: 'salaryRange', headerName: 'Salary', valueFormatter: params => params.value ? params.value : '-' }
    ];

    rowHeight = 50;

    defaultColDef: ColDef = {
        sortable: true,
        resizable: true
    };

    onFilterTextBoxChanged(event: Event) {
        const target = event.target as HTMLInputElement;
        this.quickFilterText = target.value;
    }
}
