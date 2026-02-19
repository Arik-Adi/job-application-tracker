import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

interface Resource {
    title: string;
    description: string;
    url: string;
    tag: string;
}

interface Category {
    id: string;
    label: string;
    icon: string;
    resources: Resource[];
}

@Component({
    selector: 'app-knowledge-base',
    standalone: true,
    imports: [NgClass, PageHeaderComponent],
    templateUrl: './knowledge-base.component.html',
})
export class KnowledgeBaseComponent {
    activeCategory = signal('interview');

    categories: Category[] = [
        {
            id: 'interview',
            label: 'Interview Prep',
            icon: 'psychology',
            resources: [
                {
                    title: 'Blind 75 LeetCode Problems',
                    description: 'The essential 75 coding questions curated by a Facebook engineer.',
                    url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions',
                    tag: 'Coding'
                },
                {
                    title: 'System Design Primer',
                    description: 'Learn how to design large-scale systems. Prep for the system design interview.',
                    url: 'https://github.com/donnemartin/system-design-primer',
                    tag: 'System Design'
                },
                {
                    title: 'Tech Interview Handbook',
                    description: 'Curated coding interview preparation materials for busy engineers.',
                    url: 'https://www.techinterviewhandbook.org',
                    tag: 'General'
                },
                {
                    title: 'Frontend Interview Handbook',
                    description: 'Front end interview preparation materials for busy engineers.',
                    url: 'https://www.frontendinterviewhandbook.com',
                    tag: 'Frontend'
                },
            ]
        },
        {
            id: 'behavioral',
            label: 'Behavioral',
            icon: 'people',
            resources: [
                {
                    title: 'STAR Method Guide',
                    description: 'Structure your answers using Situation, Task, Action, Result.',
                    url: 'https://www.themuse.com/advice/star-interview-method',
                    tag: 'Framework'
                },
                {
                    title: '30 Behavioral Interview Questions',
                    description: 'The most common behavioral questions and how to answer them.',
                    url: 'https://www.themuse.com/advice/30-behavioral-interview-questions-you-should-be-ready-to-answer',
                    tag: 'Questions'
                },
                {
                    title: 'Amazon Leadership Principles',
                    description: "Amazon's 16 leadership principles — useful for any behavioural interview.",
                    url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles',
                    tag: 'Culture'
                },
            ]
        },
        {
            id: 'resume',
            label: 'Resume & CV',
            icon: 'description',
            resources: [
                {
                    title: 'Resume Checklist',
                    description: 'A comprehensive checklist to make sure your resume stands out.',
                    url: 'https://www.techinterviewhandbook.org/resume/guide/',
                    tag: 'Guide'
                },
                {
                    title: 'Harvard Resume Samples',
                    description: 'Resume samples and templates from Harvard Career Services.',
                    url: 'https://ocs.fas.harvard.edu/resumes-cvs',
                    tag: 'Templates'
                },
                {
                    title: 'ATS Resume Tips',
                    description: 'How to write a resume that passes Applicant Tracking Systems.',
                    url: 'https://www.jobscan.co/blog/ats-resume/',
                    tag: 'ATS'
                },
            ]
        },
        {
            id: 'negotiation',
            label: 'Negotiation',
            icon: 'handshake',
            resources: [
                {
                    title: 'Salary Negotiation Guide',
                    description: 'Ten rules for negotiating a job offer — a widely shared classic.',
                    url: 'https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/',
                    tag: 'Salary'
                },
                {
                    title: 'Levels.fyi',
                    description: 'Real compensation data across companies, levels, and locations.',
                    url: 'https://www.levels.fyi',
                    tag: 'Research'
                },
                {
                    title: 'Glassdoor Salary Explorer',
                    description: "Explore salaries by role, company, and location.",
                    url: 'https://www.glassdoor.com/Salaries/index.htm',
                    tag: 'Research'
                },
            ]
        },
    ];

    get activeResources(): Resource[] {
        return this.categories.find(c => c.id === this.activeCategory())?.resources ?? [];
    }
}
