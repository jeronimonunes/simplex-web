import { Restriction } from './restriction';
import { Expression } from './expression';
import { Fraction, ZERO, NEG } from './fraction';
import { CanonicalAddition } from './canonical-addition';
import { Variable } from './variable';
import { CanonicalSmaller } from './canonical-smaller';

export class Smaller extends Restriction {

    constructor(private left: Expression, private right: Expression) {
        super();
    }

    canonify() {
        let left = this.left.canonify();
        if (left instanceof Fraction) {
            left = new CanonicalAddition(left, []);
        } else if (left instanceof Variable) {
            left = new CanonicalAddition(ZERO, [left]);
        }
        let right = this.right.canonify();
        if (right instanceof Fraction) {
            right = new CanonicalAddition(right, []);
        } else if (right instanceof Variable) {
            right = new CanonicalAddition(ZERO, [right]);
        }
        right.independent = right.independent.sub(left.independent);
        left.independent = ZERO;
        left.terms.push(...right.terms.map(t => t.multiply(NEG)));
        right.terms = [];
        return new CanonicalSmaller(left.terms.filter(t => !t.factor.isZero()), right.independent);
    }

    getVars(set: Set<string> = new Set<string>()): Set<string> {
        this.left.getVars(set);
        this.right.getVars(set);
        return set;
    }

}
