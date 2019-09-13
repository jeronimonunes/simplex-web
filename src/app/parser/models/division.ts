import { Expression } from './expression';
import { Multiplication } from './multiplication';

export class Division extends Expression {

    constructor(private terms: Expression[]) {
        super();
    }

    canonify() {
        const [h, ...t] = this.terms;
        for (let i = 0; i < t.length; i++) {
            t[i] = t[i].invert();
        }
        return new Multiplication([h, ...t]).canonify();
    }

    getVars(set = new Set<string>()) {
        this.terms.forEach(t => t.getVars(set));
        return set;
    }

}
