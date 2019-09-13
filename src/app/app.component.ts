import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import * as ace from 'brace';
import 'brace/theme/monokai';
import './prog-lin.ace.mod';
import { SimplexService } from './simplex.service';
import { BehaviorSubject, EMPTY, of, asyncScheduler } from 'rxjs';
import { ParserService } from './parser/parser.service';
import { switchMap, shareReplay, observeOn, tap } from 'rxjs/operators';
import { MatricialForm } from './parser/models/matricial-form';

const THEME = 'ace/theme/monokai';
const MODE = 'ace/mode/progLin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  @ViewChild('fpi', { static: true }) fpi!: ElementRef<HTMLDivElement>;

  private matricialValue = new BehaviorSubject<MatricialForm | null>(null);
  private error = new BehaviorSubject<string>('');

  error$ = this.error.asObservable();
  solution$ = this.matricialValue.pipe(
    observeOn(asyncScheduler),
    switchMap(mat => {
      if (mat === null) {
        return of(null);
      } else {
        return this.simplexService.evaluate(mat);
      }
    }),
    shareReplay(1));

  private subscription = EMPTY.subscribe();

  constructor(
    private parserService: ParserService,
    private simplexService: SimplexService
  ) {

  }

  ngOnInit() {
    const editor = ace.edit(this.editor.nativeElement);
    editor.setTheme(THEME);
    editor.getSession().setMode(MODE);
    const fpi = ace.edit(this.fpi.nativeElement);
    fpi.setTheme(THEME);
    fpi.getSession().setMode(MODE);
    fpi.setReadOnly(true);
    editor.getSession().on('change', async () => {
      this.parserService.change(editor.getValue());
    });
    this.subscription = this.parserService.data$.subscribe(value => {
      if (value === null) {
        // Message to type something?
      } else if (value.annotations) {
        editor.getSession().setAnnotations(value.annotations);
        this.matricialValue.next(null);
        this.error.next('');
        fpi.setValue('');
      } else if (value.fpi) {
        editor.getSession().clearAnnotations();
        this.matricialValue.next(null);
        this.error.next('');
        fpi.setValue(value.fpi);
        fpi.clearSelection();
      } else if (value.error) {
        editor.getSession().clearAnnotations();
        this.matricialValue.next(null);
        this.error.next(value.error);
        fpi.setValue('');
      } else {
        this.matricialValue.next(value);
        this.error.next('');
      }
    });
    editor.setValue(`max(-3a -4b +5c -5d)
    st:
        +1a +1b +0c +0d <= +5;
        -1a +0b -5c +5d <= -10;
        +2a +1b +1c -1d <= +10;
        -2a -1b -1c +1d <= -10;
        a >= 0;
        b >= 0;
        c >= 0;
        d >= 0;
`);
    editor.clearSelection();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
