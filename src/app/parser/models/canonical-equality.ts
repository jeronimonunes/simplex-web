import { CanonicalRestriction } from './canonical-restriction';
import { Variable } from './variable';
import { Fraction } from './fraction';

export class CanonicalEquality extends CanonicalRestriction {

    constructor(private left: Variable[], private right: Fraction) {
        super();
    }

    isNonNegativity(): boolean {
        return false;
    }

    turnIntoEquality(positiveVars: Set<string>) {
        return this;
    }

    toString() {
        let result = '';
        for (const v of this.left) {
            if (result) {
                if (v.factor.isPositive() || v.factor.isZero()) {
                    result += ' + ';
                } else {
                    result += ' - ';
                }
            }
            result += v.toString(false);
        }
        return `${result} == ${this.right}`;
    }

    replaceVar(label: string, replace: Variable[]) {
        const left = new Array<Variable>();
        for (const term of this.left) {
            if (term.label === label) {
                left.push(...replace.map(rep => rep.multiply(term.factor)));
            } else {
                left.push(term);
            }
        }
        return new CanonicalEquality(left, this.right);
    }

}
