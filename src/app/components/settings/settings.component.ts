import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { JobStore } from '../../store/job.store';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [AsyncPipe, PageHeaderComponent, ButtonComponent],
    templateUrl: './settings.component.html',
})
export class SettingsComponent {
    auth = inject(AuthService);
    private store = inject(JobStore);
    private dialog = inject(Dialog);

    login() {
        this.auth.login().catch(err => console.error('Login failed', err));
    }

    logout() {
        this.auth.logout().catch(err => console.error('Logout failed', err));
    }

    clearData() {
        const dialogRef = this.dialog.open<boolean>(ConfirmationDialogComponent, {
            width: '400px',
            panelClass: 'bg-transparent',
            disableClose: true,
            data: {
                title: 'Clear All Data',
                message: 'This will permanently delete all your locally stored jobs. This action cannot be undone.',
                isDestructive: true
            }
        });

        dialogRef.closed.subscribe(confirmed => {
            if (confirmed) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }
}
