import { Expression } from './expression';
import { Fraction } from './fraction';

export class Variable extends Expression {

    constructor(private factor: Fraction, public label: string) {
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
}
