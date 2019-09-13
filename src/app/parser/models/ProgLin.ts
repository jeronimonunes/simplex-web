
import { Restriction } from './restriction';
import { Multiplication } from './multiplication';
import { NEG, Fraction, ZERO, ONE } from './fraction';
import { Expression } from './expression';
import { CanonicalAddition } from './canonical-addition';
import { Variable } from './variable';
import { Fpi } from './fpi';
import { CanonicalRestriction } from './canonical-restriction';
import { Addition } from './addition';
import { Equality } from './equality';

export type ProgLinType = 'min' | 'max';

export class ProgLin {

    constructor(
        private type: ProgLinType,
        private objective: Expression,
        private restrictions: Restriction[]) {
    }

    toFPI() {
        const vars = new Set<string>();

        const objective2b = this.objective.canonify();
        let objective: CanonicalAddition;
        if (objective2b instanceof Fraction) {
            objective = new CanonicalAddition(objective2b, []);
        } else if (objective2b instanceof Variable) {
            objective = new CanonicalAddition(ZERO, [objective2b]);
        } else {
            objective = objective2b;
        }
        objective.getVars(vars);
        if (this.type === 'min') {
            objective = new Multiplication([NEG, objective]).canonify();
        }

        const positiveVars = new Set<string>();
        const restrictions: CanonicalRestriction[] = [];
        for (const r of this.restrictions) {
            r.getVars(vars);
            const rcanon = r.canonify();
            if (rcanon.isNonNegativity()) {
                r.getVars().forEach(v => positiveVars.add(v));
            } else {
                restrictions.push(rcanon);
            }
        }

        let equalities = restrictions.map(r => r.turnIntoEquality(positiveVars));
        const variableChanges: Equality[] = [];
        for (const v of vars) {
            if (!positiveVars.has(v)) {
                positiveVars.add(v + 'p');
                positiveVars.add(v + 'n');
                const replace = [new Variable(ONE, v + 'p'), new Variable(NEG, v + 'n')];
                variableChanges.push(new Equality(new Variable(ONE, v), new Addition(replace)));
                objective = objective.replaceVar(v, replace);
                equalities = equalities.map(r => r.replaceVar(v, replace));
            }
        }
        return new Fpi(objective, equalities, [...positiveVars]);
    }

}
