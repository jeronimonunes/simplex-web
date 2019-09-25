/// <reference lib="webworker" />

import * as pegjs from 'pegjs';
import langSource from '!raw-loader!./lang.pegjs';
import { ProgLin } from './models/ProgLin';
import { Addition } from './models/addition';
import { Variable } from './models/variable';
import { Factor } from './models/factor';
import { Subtraction } from './models/subtraction';
import { Multiplication } from './models/multiplication';
import { Division } from './models/division';
import { Equality } from './models/equality';
import { Greater } from './models/greater';
import { Smaller } from './models/smaller';
import { Fraction, ONE, NEG } from './models/fraction';
import { ParserOutput } from './parser-output';

// tslint:disable: no-string-literal

// Unfortunatelly pegjs does not have a way for us to pass the necessary classes.

declare var self: any;

self['ProgLin'] = ProgLin;
self['Addition'] = Addition;
self['Subtraction'] = Subtraction;
self['Multiplication'] = Multiplication;
self['Division'] = Division;
self['Variable'] = Variable;
self['Factor'] = Factor;
self['Equality'] = Equality;
self['Greater'] = Greater;
self['Smaller'] = Smaller;
self['Fraction'] = Fraction;
self['ONE'] = ONE;
self['NEG'] = NEG;

export const langParser = pegjs.generate(langSource);


addEventListener('message', ({ data }) => {
  try {
    const val = langParser.parse(data || '') as ProgLin;
    const fpi = val.toFPI();
    postMessage({
      fpi: fpi.toString()
    } as ParserOutput);
    postMessage(fpi.toMatrix());
  } catch (e) {
    if (e instanceof langParser.SyntaxError) {
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
