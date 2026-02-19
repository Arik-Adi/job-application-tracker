import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'jobs',
        loadComponent: () => import('./components/jobs-grid/jobs-grid.component').then(m => m.JobsGridComponent)
    },
    {
        path: 'pipeline',
        loadComponent: () => import('./components/pipeline/pipeline.component').then(m => m.PipelineComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
    },
    {
        path: 'knowledge-base',
        loadComponent: () => import('./components/knowledge-base/knowledge-base.component').then(m => m.KnowledgeBaseComponent)
    },
];
