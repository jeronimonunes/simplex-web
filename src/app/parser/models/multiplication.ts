import { Expression } from './expression';
import { Addition } from './addition';

export class Multiplication extends Expression {

    constructor(private terms: Expression[]) {
        super();
    }

    canonify() {
        const head = this.terms[0].canonify();
        let v: Addition;
        if (head instanceof Addition) {
            v = head;
        } else {
            v = new Addition([head]);
        }
        for (let i = 1; i < this.terms.length; i++) {
            const t = this.terms[i].canonify();
            v = v.multiply(t);
        }
        return v.canonify();
    }

    getVars(set = new Set<string>()) {
        this.terms.forEach(t => t.getVars(set));
        return set;
    }

}
