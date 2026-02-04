import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css'
})
export class ButtonComponent {
    @Input() variant: ButtonVariant = 'primary';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled = false;

    get baseClasses(): string {
        return 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 duration-200 flex items-center gap-2';
    }

    get variantClasses(): string {
        switch (this.variant) {
            case 'primary':
                return 'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 shadow-lg shadow-indigo-500/20';
            case 'secondary':
                return 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500';
            case 'danger':
                return 'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500';
            case 'ghost':
                return 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white focus:ring-slate-500';
            default:
                return '';
        }
    }
}
