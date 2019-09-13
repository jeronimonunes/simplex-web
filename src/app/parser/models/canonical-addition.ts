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

    toString() {
        let result = '';
        if (!this.independent.isZero()) {
            result += this.independent;
        }
        for (const term of this.terms) {
            if (result) {
                result += ' ';
            }
            result += term;
        }
        return result;
    }

    replaceVar(label: string, replace: Variable[]) {
        const terms = new Array<Variable>();
        for (const term of this.terms) {
            if (term.label === label) {
                terms.push(...replace.map(rep => rep.multiply(term.factor)));
            } else {
                terms.push(term);
            }
        }
        return new CanonicalAddition(this.independent, terms);
    }

}
