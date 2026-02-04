import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { JobStore } from '../../store/job.store';
import { TranslatePipe } from '@ngx-translate/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
    selector: 'app-jobs-grid',
    standalone: true,
    imports: [AgGridAngular, TranslatePipe],
    templateUrl: './jobs-grid.component.html',
    styleUrl: './jobs-grid.component.css'
})
export class JobsGridComponent {
    readonly store = inject(JobStore);

    // Column Definitions: Defines the columns to be displayed.
    colDefs: ColDef[] = [
        { field: 'company', headerName: 'Company', filter: true, flex: 1 },
        { field: 'role', headerName: 'Role', filter: true, flex: 1 },
        {
            field: 'status', headerName: 'Status', filter: true, flex: 1,
            cellClassRules: {
                'text-green-400': params => params.value === 'Offer',
                'text-red-400': params => params.value === 'Rejected',
                'text-blue-400': params => params.value === 'Interviewing',
                'text-amber-400': params => params.value === 'Applied'
            }
        },
        { field: 'dateApplied', headerName: 'Date Applied', filter: 'agDateColumnFilter' },
        { field: 'salaryRange', headerName: 'Salary', valueFormatter: params => params.value ? `$${params.value}` : '-' }
    ];

    defaultColDef: ColDef = {
        sortable: true,
        resizable: true
    };
}
