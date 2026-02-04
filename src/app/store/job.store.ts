import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Job } from '../models/job.model';

const MOCK_JOBS: Job[] = [
    {
        id: '1',
        company: 'Google',
        role: 'Senior Angular Engineer',
        status: 'Interviewing',
        location: 'Mountain View, CA',
        salaryRange: '$180k - $240k',
        dateApplied: new Date('2024-01-15'),
        description: 'Building the next generation of Google Cloud Console.',
        techStack: ['Angular', 'TypeScript', 'RxJS', 'Bazel'],
        matchScore: 92,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
    },
    {
        id: '2',
        company: 'Netflix',
        role: 'UI Engineer, Core Experience',
        status: 'Applied',
        location: 'Remote',
        salaryRange: '$220k - $300k',
        dateApplied: new Date('2024-02-01'),
        description: 'Developing key features for the TV UI.',
        techStack: ['React', 'TypeScript', 'GraphQL'],
        matchScore: 85,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
    },
    {
        id: '3',
        company: 'Microsoft',
        role: 'Frontend Architect',
        status: 'Wishlist',
        location: 'Redmond, WA',
        salaryRange: '$190k - $250k',
        dateApplied: new Date('2024-02-05'),
        description: 'Architectural leadership for Azure Portal.',
        techStack: ['Angular', 'React', 'Micro-frontends'],
        matchScore: 88,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05')
    },
    {
        id: '4',
        company: 'Spotify',
        role: 'Web Engineer',
        status: 'Offer',
        location: 'New York, NY',
        salaryRange: '$170k - $210k',
        dateApplied: new Date('2023-12-10'),
        description: 'Join the desktop app team.',
        techStack: ['TypeScript', 'React', 'Next.js'],
        matchScore: 95,
        createdAt: new Date('2023-12-10'),
        updatedAt: new Date('2024-01-25')
    }
];

export interface JobState {
    jobs: Job[];
    isLoading: boolean;
    filter: string;
}

const initialState: JobState = {
    jobs: MOCK_JOBS,
    isLoading: false,
    filter: 'ALL',
};

export const JobStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        setLoading(isLoading: boolean) {
            patchState(store, { isLoading });
        },
        addJob(job: Job) {
            patchState(store, (state) => ({ jobs: [...state.jobs, job] }));
        },
        updateStatus(id: string, status: Job['status']) {
            patchState(store, (state) => ({
                jobs: state.jobs.map(job => job.id === id ? { ...job, status } : job)
            }));
        }
        // Add more methods as needed
    }))
);
