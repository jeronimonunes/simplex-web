import { Fraction } from './fraction';
import { Expression } from './expression';
import { Variable } from './variable';

export class CanonicalAddition extends Expression {

    constructor(public independent: Fraction, public terms: Variable[]) {
        super();
    }

    canonify() {
        return this;
    }

    getVars(set = new Set<string>()) {
        this.terms.forEach(term => term.getVars(set));
        return set;
    }

    multiply(v: Fraction) {
        return new CanonicalAddition(this.independent.multiply(v), this.terms.map(t => t.multiply(v)));
    }

}
