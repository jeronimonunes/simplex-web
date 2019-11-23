import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Result, Tabloid } from 'src/native/simplex';
import { MatricialForm } from './parser/matricial-form';

@Injectable({
  providedIn: 'root'
})
export class SimplexService {

  constructor() { }

  evaluate(mat: MatricialForm | null) {
    if (mat) {
      return new Observable<{ answear: Result, steps: Tabloid[] }>(observer => {
        const worker = new Worker('./simplex.worker', { type: 'module' });
        worker.onmessage = ({ data }) => {
          observer.next(data);
          observer.complete();
          worker.terminate();
        };
        worker.postMessage(mat);
        return () => {
          worker.terminate();
        };
      });
    } else {
      return of(null);
    }
  }
}
