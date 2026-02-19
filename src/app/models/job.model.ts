export type JobStatus = 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Job {
    id: string;
    company: string;
    role: string;
    status: JobStatus;
    location?: string;
    salaryRange?: string;
    dateApplied?: Date;
    description: string;
    techStack: string[];
    matchScore: number;
    url?: string;
    recruitingContact?: string;
    comments?: string;
    glassdoorUrl?: string;
    documents?: {
        cvUrl: string;
        coverLetterUrl?: string;
    };
    aiAnalysis?: {
        criticalSkills: string[];
        missingSkills: string[];
        interviewDeepDives: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}
