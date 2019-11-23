/// <reference lib="webworker" />

import { ParserOutput } from './parser-output';
import { parse, SyntaxError } from 'linear-program-parser';
import { MatricialForm } from './matricial-form';

// tslint:disable: no-string-literal

// Unfortunatelly pegjs does not have a way for us to pass the necessary classes.

const toNativeFraction = (f: any) => ({
  numerator: '' + f.numerator,
  denominator: '' + f.denominator,
});

addEventListener('message', ({ data }) => {
  try {
    const val = parse(data || '');
    const fpi = val.toFPI();
    postMessage({
      fpi: fpi.toString()
    } as ParserOutput);
    const { a, b, c, vars } = fpi.toMatrix();
    const matricialForm: MatricialForm = {
      a: a.map(row => row.map(toNativeFraction)),
      b: b.map(toNativeFraction),
      c: c.map(toNativeFraction),
      vars
    };
    postMessage(matricialForm);
  } catch (e) {
    if (e instanceof SyntaxError) {
      postMessage({
        annotations: [{
          column: e.location.start.column - 1,
          row: e.location.start.line - 1,
          text: e.message,
          type: 'error'
        }]
      } as ParserOutput);
    } else {
      postMessage({ error: e.message } as ParserOutput);
    }
    console.error(e);
  }
});
