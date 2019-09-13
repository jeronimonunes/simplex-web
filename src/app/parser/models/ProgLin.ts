
import { Restriction } from './restriction';
import { Multiplication } from './multiplication';
import { NEG, Fraction, ZERO } from './fraction';
import { Expression } from './expression';
import { CanonicalAddition } from './canonical-addition';
import { Variable } from './variable';
import { Fpi } from './fpi';

export type ProgLinType = 'min' | 'max';

export class ProgLin {

    constructor(
        private type: ProgLinType,
        private objective: Expression,
        private restrictions: Restriction[]) {
    }

}
