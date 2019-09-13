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
import { Fraction, ONE } from './models/fraction';

// tslint:disable: no-string-literal

// Unfortunatelly pegjs does not have a way for us to pass the necessary classes.

window['ProgLin'] = ProgLin;
window['Addition'] = Addition;
window['Subtraction'] = Subtraction;
window['Multiplication'] = Multiplication;
window['Division'] = Division;
window['Variable'] = Variable;
window['Factor'] = Factor;
window['Equality'] = Equality;
window['Greater'] = Greater;
window['Smaller'] = Smaller;
window['Fraction'] = Fraction;
window['ONE'] = ONE;

export const langParser = pegjs.generate(langSource);
