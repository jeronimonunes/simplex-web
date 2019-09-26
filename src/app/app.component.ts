import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SimplexService } from './simplex.service';
import { BehaviorSubject, EMPTY, asyncScheduler } from 'rxjs';
import { ParserService } from './parser/parser.service';
import { switchMap, shareReplay, observeOn, map } from 'rxjs/operators';
import { MatricialForm } from './parser/models/matricial-form';
import { Tabloid } from 'src/native/simplex';
import './prog-lin.ace.mod';
import 'ace-builds/src-noconflict/theme-monokai';
import { edit } from 'ace-builds';

const THEME = 'ace/theme/monokai';
const MODE = 'ace/mode/progLin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private parserService: ParserService,
    private simplexService: SimplexService
  ) {

  }

  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  @ViewChild('fpi', { static: true }) fpi!: ElementRef<HTMLDivElement>;

  private matricialValue = new BehaviorSubject<MatricialForm | null>(null);
  private error = new BehaviorSubject<string>('');

  vars$ = this.matricialValue.pipe(map(mat => mat ? mat.vars : null));
  error$ = this.error.asObservable();
  solution$ = this.matricialValue.pipe(
    observeOn(asyncScheduler),
    switchMap(mat => this.simplexService.evaluate(mat)),
    shareReplay(1));

  answear$ = this.solution$.pipe(map(v => v ? v.answear : null));
  steps$ = this.solution$.pipe(map(v => v ? v.steps : null));

  numberOfColumns$ = this.steps$.pipe(map(steps => {
    if (steps) {
      return steps.reduce((acc, val) =>
        Math.max(val.certificate.length + val.C.length + 1, acc), 0);
    } else {
      return 0;
    }
  }), shareReplay(1));

  style$ = this.numberOfColumns$.pipe(map(cols => {
    return {
      'grid-template-columns': `repeat(${cols}, auto)`
    };
  }));

  headStyle$ = this.numberOfColumns$.pipe(map(cols => {
    return {
      'grid-column-start': 'span ' + cols
    };
  }));

  private subscription = EMPTY.subscribe();

  spacerStyle$(val: Tabloid) {
    return this.numberOfColumns$.pipe(map(cols => {
      const diff = cols - val.certificate.length - val.C.length - 1;
      return diff ? { 'grid-column-end': 'span ' + diff } : { display: 'none' };
    }));
  }

  ngOnInit() {
    const inputEditor = edit(this.editor.nativeElement);
    inputEditor.setTheme(THEME);
    inputEditor.getSession().setMode(MODE);

    const fpiEditor = edit(this.fpi.nativeElement);
    fpiEditor.setTheme(THEME);
    fpiEditor.getSession().setMode(MODE);
    fpiEditor.setReadOnly(true);

    inputEditor.on('change', async () => {
      this.parserService.next(inputEditor.getValue());
    });

    this.subscription = this.parserService.data$.subscribe(value => {
      if (value === null) {
        // Message to type something?
      } else if (value.annotations) {
        inputEditor.getSession().setAnnotations(value.annotations);
        this.matricialValue.next(null);
        this.error.next('');
        fpiEditor.setValue('');
      } else if (value.fpi) {
        inputEditor.getSession().clearAnnotations();
        this.matricialValue.next(null);
        this.error.next('');
        fpiEditor.setValue(value.fpi);
        fpiEditor.clearSelection();
      } else if (value.error) {
        inputEditor.getSession().clearAnnotations();
        this.matricialValue.next(null);
        this.error.next(value.error);
        fpiEditor.setValue('');
      } else {
        this.matricialValue.next(value);
        this.error.next('');
      }
    });
    inputEditor.setValue(`max(-3a -4b +5c -5d)
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
    inputEditor.clearSelection();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
