import { Observable, tap } from 'rxjs';

export function debug<T>(tag: string) {
    return (source: Observable<T>) => {
        return source.pipe(
            tap({
                next(value) {
                    console.log(`%c[${tag}: Next]`, 'color: #4CAF50; font-weight: bold', value);
                },
                error(error) {
                    console.log(`%c[${tag}: Error]`, 'color: #F44336; font-weight: bold', error);
                },
                complete() {
                    console.log(`%c[${tag}: Complete]`, 'color: #2196F3; font-weight: bold');
                }
            })
        );
    };
}
