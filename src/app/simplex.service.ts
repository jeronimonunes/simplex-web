import { Injectable } from '@angular/core';
import { Fpi } from './parser/models/fpi';
import { Observable } from 'rxjs';
import { Result } from 'src/native/simplex';
import { MatricialForm } from './parser/models/matricial-form';

@Injectable({
  providedIn: 'root'
})
export class SimplexService {

  constructor() { }

  evaluate(mat: MatricialForm) {
    return new Observable<Result>(observer => {
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
  }
}
