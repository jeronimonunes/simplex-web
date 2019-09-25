import { Fraction, ZERO } from './fraction';
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

    getCoefficient(label: string) {
        for (const term of this.terms) {
            if (term.label === label) {
                return term.factor;
            }
        }
        return ZERO;
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
            if (term.factor.isZero()) {
            } else if (term.factor.isPositive()) {
                if (result) {
                    result += ' + ';
                }
            } else {
                if (result) {
                    result += ' - ';
                } else {
                    result += '-';
                }
            }
            result += term.toString(false);
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
