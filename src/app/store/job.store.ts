import { patchState, signalStore, withMethods, withState, withHooks } from '@ngrx/signals';
import { Job } from '../models/job.model';
import { inject } from '@angular/core';
import { Firestore, collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../core/services/auth.service';
import { Observable, tap, switchMap, of, catchError, map, from } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

const STORAGE_KEY = 'devstep_jobs';
const GUEST_FLAG_KEY = 'devstep_jobs_is_guest';

const loadFromStorage = (): Job[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            return parsed.jobs.map((job: any) => ({
                ...job,
                dateApplied: new Date(job.dateApplied),
                createdAt: new Date(job.createdAt),
                updatedAt: new Date(job.updatedAt)
            }));
        } catch (e) {
            console.error('Failed to parse jobs from persistence', e);
        }
    }
    return [];
};

const saveToStorage = (jobs: Job[], isGuest = false) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ jobs, isLoading: false, filter: 'ALL' }));
        localStorage.setItem(GUEST_FLAG_KEY, String(isGuest));
    } catch (e) {
        console.error('Failed to save to local storage', e);
    }
};

const isGuestData = (): boolean => localStorage.getItem(GUEST_FLAG_KEY) === 'true';

export interface JobState {
    jobs: Job[];
    isLoading: boolean;
    filter: string;
}

const initialState: JobState = {
    jobs: loadFromStorage(),
    isLoading: false,
    filter: 'ALL',
};

export const JobStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => {
        const firestore = inject(Firestore);
        const authService = inject(AuthService);

        return {
            setLoading(isLoading: boolean) {
                patchState(store, { isLoading });
            },

            _syncJobs: rxMethod<string | null>(
                (uid$) => uid$.pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(uid => {
                        if (!uid) {
                            // GUEST MODE: Load from LocalStorage
                            const localJobs = loadFromStorage();
                            patchState(store, { jobs: localJobs, isLoading: false });
                            saveToStorage(localJobs, true);
                            return of([]);
                        }

                        // CLOUD MODE: Migrate guest jobs first (if any), then subscribe
                        const guestJobs = isGuestData() ? loadFromStorage() : [];
                        const migrations = guestJobs.map(job => {
                            const jobRef = doc(firestore, `users/${uid}/jobs/${job.id}`);
                            return setDoc(jobRef, job);
                        });

                        return from(Promise.all(migrations).catch(err => {
                            console.error('Guest job migration failed', err);
                            return [];
                        })).pipe(
                            switchMap(() => {
                                // Clear guest flag — Firestore is now the source of truth
                                localStorage.removeItem(GUEST_FLAG_KEY);
                                const col = collection(firestore, `users/${uid}/jobs`);
                                return new Observable<any[]>(observer => {
                                    const unsubscribe = onSnapshot(
                                        col,
                                        snapshot => observer.next(
                                            snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
                                        ),
                                        error => observer.error(error)
                                    );
                                    return () => unsubscribe();
                                });
                            }),
                            tap(jobs => {
                                const parsedJobs = jobs.map((job: any) => ({
                                    ...job,
                                    dateApplied: job.dateApplied?.toDate ? job.dateApplied.toDate() : new Date(job.dateApplied),
                                    createdAt: job.createdAt?.toDate ? job.createdAt.toDate() : new Date(job.createdAt),
                                    updatedAt: job.updatedAt?.toDate ? job.updatedAt.toDate() : new Date(job.updatedAt)
                                })) as Job[];
                                patchState(store, { jobs: parsedJobs, isLoading: false });
                                saveToStorage(parsedJobs, false);
                            }),
                            catchError(err => {
                                console.error('Firestore sync error', err);
                                patchState(store, { isLoading: false });
                                return of([]);
                            })
                        );
                    })
                )
            ),

            async addJob(job: Job) {
                const user = authService.user();
                const id = job.id || crypto.randomUUID();
                const jobToSave = { ...job, id };

                if (user) {
                    try {
                        const jobRef = doc(firestore, `users/${user.uid}/jobs/${id}`);
                        await setDoc(jobRef, jobToSave);
                    } catch (e) {
                        console.error('Error adding job to cloud', e);
                    }
                } else {
                    patchState(store, (state) => {
                        const newJobs = [...state.jobs, jobToSave];
                        saveToStorage(newJobs, true);
                        return { jobs: newJobs };
                    });
                }
            },

            async updateJob(updatedJob: Job) {
                const user = authService.user();
                if (user) {
                    try {
                        const jobRef = doc(firestore, `users/${user.uid}/jobs/${updatedJob.id}`);
                        await updateDoc(jobRef, { ...updatedJob, updatedAt: new Date() });
                    } catch (e) {
                        console.error('Error updating job in cloud', e);
                    }
                } else {
                    patchState(store, (state) => {
                        const newJobs = state.jobs.map(job => job.id === updatedJob.id ? updatedJob : job);
                        saveToStorage(newJobs, true);
                        return { jobs: newJobs };
                    });
                }
            },

            async deleteJob(id: string) {
                const user = authService.user();
                if (user) {
                    try {
                        const jobRef = doc(firestore, `users/${user.uid}/jobs/${id}`);
                        await deleteDoc(jobRef);
                    } catch (e) {
                        console.error('Error deleting job from cloud', e);
                    }
                } else {
                    patchState(store, (state) => {
                        const newJobs = state.jobs.filter(job => job.id !== id);
                        saveToStorage(newJobs, true);
                        return { jobs: newJobs };
                    });
                }
            },

            async updateStatus(id: string, status: Job['status']) {
                const user = authService.user();
                if (user) {
                    try {
                        const jobRef = doc(firestore, `users/${user.uid}/jobs/${id}`);
                        await updateDoc(jobRef, { status, updatedAt: new Date() });
                    } catch (e) {
                        console.error('Error updating status in cloud', e);
                    }
                } else {
                    patchState(store, (state) => {
                        const newJobs = state.jobs.map(job => job.id === id ? { ...job, status } : job);
                        saveToStorage(newJobs, true);
                        return { jobs: newJobs };
                    });
                }
            }
        };
    }),
    withHooks({
        onInit(store) {
            const authService = inject(AuthService);
            store._syncJobs(authService.user$.pipe(
                map(u => u?.uid ?? null)
            ));
        }
    })
);
