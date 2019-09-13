import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as ace from 'brace';
import 'brace/theme/monokai';
import './prog-lin.ace.mod';
import { langParser } from './parser/parser';
import { ProgLin } from './parser/models/ProgLin';
import { SimplexService } from './simplex.service';
import { BehaviorSubject, of } from 'rxjs';
import { Fpi } from './parser/models/fpi';
import { switchMap, shareReplay, debounceTime } from 'rxjs/operators';

const THEME = 'ace/theme/monokai';
const MODE = 'ace/mode/progLin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  @ViewChild('fpi', { static: true }) fpi!: ElementRef<HTMLDivElement>;

  resultingFPI = new BehaviorSubject<null | Fpi>(null);

  solution$ = this.resultingFPI.pipe(
    debounceTime(500),
    switchMap(fpi => fpi === null ? of(null) : this.simplexService.evaluate(fpi)
    ), shareReplay(1));

  constructor(private simplexService: SimplexService) {

  }

  ngOnInit() {
    const editor = ace.edit(this.editor.nativeElement);
    editor.setTheme(THEME);
    editor.getSession().setMode(MODE);
    const fpi = ace.edit(this.fpi.nativeElement);
    fpi.setTheme(THEME);
    fpi.getSession().setMode(MODE);
    fpi.setReadOnly(true);
    editor.getSession().on('change', () => {
      try {
        const val = langParser.parse(editor.getValue()) as ProgLin;
        const fpii = val.toFPI();
        fpi.setValue(fpii.toString());
        fpi.clearSelection();
        editor.getSession().clearAnnotations();
        this.resultingFPI.next(fpii);
      } catch (e) {
        this.resultingFPI.next(null);
        if (e instanceof langParser.SyntaxError) {
          editor.getSession().setAnnotations([
            {
              column: e.location.start.column - 1,
              row: e.location.start.line - 1,
              text: e.message,
              type: 'error'
            }
          ]);
        }
        console.error(e);
      }
    });
    editor.setValue(`max(0 -3a -4b +5c -5d)
    st:
        0 +1a +1b +0c +0d <= 0 +5;
        0 -1a +0b -5c +5d <= 0 -10;
        0 +2a +1b +1c -1d <= 0 +10;
        0 -2a -1b -1c +1d <= 0 -10;
        a >= 0;
        b >= 0;
        c >= 0;
        d >= 0;
`);
    editor.clearSelection();
  }

}
