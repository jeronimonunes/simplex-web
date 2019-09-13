import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  private worker: Worker;
  private data = new BehaviorSubject<any>(null);
  public data$ = this.data.asObservable();

  constructor() {
    this.worker = new Worker('./parser.worker', { type: 'module' });
    this.worker.onmessage = ({ data }) => {
      this.data.next(data);
    };
  }

  change(value: string) {
    this.worker.postMessage(value);
  }
}
