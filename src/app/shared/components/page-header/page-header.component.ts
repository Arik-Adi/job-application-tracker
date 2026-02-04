import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-page-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.css'
})
export class PageHeaderComponent {
    // Using content projection, but we can also accept inputs if needed for simple text
    // We'll primarily mock up slots for title, subtitle, and actions via ng-content selectors
}
