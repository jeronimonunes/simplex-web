import { Fraction } from './fraction';
import { Variable } from './variable';
import { CanonicalAddition } from './canonical-addition';

export abstract class Expression {

    abstract canonify(): CanonicalAddition | Variable | Fraction;
    abstract getVars(vars?: Set<string>): Set<string>;

    invert(): Expression {
        throw new Error('Tried to invert something that we can\'t yet invert');
    }
}
