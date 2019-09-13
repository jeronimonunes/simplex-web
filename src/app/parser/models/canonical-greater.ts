import { CanonicalRestriction } from './canonical-restriction';
import { Fraction, NEG } from './fraction';
import { Variable } from './variable';
import { CanonicalEquality } from './canonical-equality';

export class CanonicalGreater extends CanonicalRestriction {

    constructor(private left: Variable[], private right: Fraction) {
        super();
    }

    isNonNegativity(): boolean {
        return this.left.length === 1 && this.left[0].factor.isPositive() && this.right.isZero();
    }

    turnIntoEquality(positiveVars: Set<string>): CanonicalEquality {
        let i = 1;
        while (positiveVars.has('f_' + i)) { i++; }
        positiveVars.add('f_' + i);
        const v = new Variable(NEG, 'f_' + i);
        return new CanonicalEquality([v, ...this.left], this.right);
    }
}
