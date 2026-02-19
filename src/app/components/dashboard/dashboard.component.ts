import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../core/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { JobStore } from '../../store/job.store';
import { Job } from '../../models/job.model';
import { AddJobDialogComponent } from '../add-job-dialog/add-job-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslatePipe, PageHeaderComponent, ButtonComponent, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  auth = inject(AuthService);
  private dialog = inject(Dialog);
  private store = inject(JobStore);

  login() {
    this.auth.login().catch(err => console.error('Login failed', err));
  }

  logout() {
    this.auth.logout().catch(err => console.error('Logout failed', err));
  }

  addJob() {
    const dialogRef = this.dialog.open<Job>(AddJobDialogComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'bg-transparent'
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        const newJob = {
          ...result,
          id: crypto.randomUUID(),
          matchScore: 0,
          techStack: [],
        } as Job;
        this.store.addJob(newJob);
      }
    });
  }
}
