import { Expression } from './expression';
import { Fraction, ZERO } from './fraction';
import { Variable } from './variable';
import { unexhaustive } from './util';
import { CanonicalAddition } from './canonical-addition';

export class Addition extends Expression {

    constructor(private terms: Expression[]) {
        super();
    }

    canonify(): CanonicalAddition {
        const pile = this.terms.slice();
        const vars: { [key: string]: Variable } = {};
        let num = ZERO;
        for (let u = pile.pop(); u; u = pile.pop()) {
            const v = u.canonify();
            if (v instanceof Fraction) {
                num = num.add(v);
            } else if (v instanceof Variable) {
                if (vars[v.label]) {
                    vars[v.label] = vars[v.label].add(v);
                } else {
                    vars[v.label] = v;
                }
            } else if (v instanceof CanonicalAddition) {
                pile.push(v.independent);
                pile.push(...v.terms);
            } else {
                unexhaustive(v);
            }
        }
        return new CanonicalAddition(num, Object.values(vars));
    }

    multiply(v: Fraction | Variable | Addition | CanonicalAddition): Addition {
        if (v instanceof Fraction) {
            return new Addition(this.terms.map(term => {
                const canon = term.canonify();
                return canon.multiply(v);
            }));
        } else if (v instanceof Variable) {
            return new Addition(this.terms.map(term => {
                const canon = term.canonify();
                if (canon instanceof Fraction) {
                    return v.multiply(canon);
                } else if (canon instanceof Variable) {
                    throw Error('In linear progarmming you can\'t have two variables multiplying each other');
                } else if (canon instanceof Addition) {
                    return canon.multiply(v);
                } else if (canon instanceof CanonicalAddition) {
                    if (canon.terms.length === 0) {
                        return v.multiply(canon.independent);
                    } else {
                        throw Error('In linear progarmming you can\'t have two variables multiplying each other');
                    }
                } else {
                    return unexhaustive(canon);
                }
            }));
        } else if (v instanceof Addition) {
            const terms = this.terms.reduce((acc, val) => {
                const sub = v.multiply(val.canonify());
                acc.push(...sub.terms);
                return acc;
            }, new Array<Expression>());
            return new Addition(terms);
        } else if (v instanceof CanonicalAddition) {
            return this.multiply(new Addition([v.independent, ...v.terms]));
        } else {
            return unexhaustive(v);
        }
    }

    getVars(set = new Set<string>()) {
        this.terms.forEach(t => t.getVars(set));
        return set;
    }

}
