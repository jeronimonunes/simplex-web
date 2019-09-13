import { Component, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import * as ace from 'brace';
import 'brace/theme/monokai';
import './prog-lin.ace.mod';
import { langParser } from './parser/parser';
import { ProgLin } from './parser/models/ProgLin';

const THEME = 'ace/theme/monokai';
const MODE = 'ace/mode/progLin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  @ViewChild('editor', { static: true }) editor: ElementRef<HTMLDivElement>;

  constructor() {

  }

  ngOnInit() {
    const editor = ace.edit(this.editor.nativeElement);
    editor.setTheme(THEME);
    editor.getSession().setMode(MODE);
    editor.getSession().on('change', () => {
      try {
        const val = langParser.parse(editor.getValue()) as ProgLin;
        editor.getSession().clearAnnotations();
      } catch (e) {
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
