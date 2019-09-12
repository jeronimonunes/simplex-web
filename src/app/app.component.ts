import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as ace from 'brace';
import 'brace/theme/monokai';
import './prog-lin.ace.mod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('editor', { static: true }) editor: ElementRef<HTMLDivElement>;

  constructor() {

  }

  ngOnInit() {
    const editor = ace.edit(this.editor.nativeElement);
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/progLin');
    setTimeout(() => {
      editor.setValue(
        `max(0 -3a -4b +5c -5d)
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
    });
  }

}
