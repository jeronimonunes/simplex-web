import { Expression } from './expression';
import { Fraction } from './fraction';

export class Variable extends Expression {

    constructor(public factor: Fraction, public label: string) {
        super();
    }

    add(v: Variable) {
        if (v.label === this.label) {
            return new Variable(this.factor.add(v.factor), v.label);
        } else {
            throw new Error('Can not perform addition of: ' + this + ' and ' + v);
        }
    }

    multiply(v: Fraction) {
        return new Variable(this.factor.multiply(v), this.label);
    }

    canonify() {
        return this;
    }

    getVars(set = new Set<string>()) {
        set.add(this.label);
        return set;
    }

    toString(sign = true) {
        let fac = this.factor.toString(false);
        if (fac.indexOf('/') !== -1) {
            fac = '(' + fac + ')';
        }
        return fac + this.label;
    }
}
