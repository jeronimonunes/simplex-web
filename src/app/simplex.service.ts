import { Injectable } from '@angular/core';
import { Fpi } from './parser/models/fpi';
import { Observable } from 'rxjs';
import { NativeFraction } from 'src/native/simplex';

@Injectable({
  providedIn: 'root'
})
export class SimplexService {

  constructor() { }

  evaluate(fpi: Fpi) {
    return new Observable<{
      value: NativeFraction,
      solution: NativeFraction[],
      certificate: NativeFraction[],
      type: 'ILIMITED' | 'LIMITED' | 'UNFEASEABLE'
    }>(observer => {
      const worker = new Worker('./simplex.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        observer.next(data);
        observer.complete();
        worker.terminate();
      };
      worker.postMessage(fpi.toMatrix());
      return () => {
        worker.terminate();
      };
    });
  }
}
