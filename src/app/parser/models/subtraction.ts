import { Expression } from './expression';
import { Multiplication } from './multiplication';
import { NEG } from './fraction';
import { Addition } from './addition';

export class Subtraction extends Expression {

    constructor(private terms: Expression[]) {
        super();
    }

    canonify() {
        const [h, ...tail] = this.terms;
        for (let i = 0; i < tail.length; i++) {
            tail[i] = new Multiplication([tail[i], NEG]).canonify();
        }
        return new Addition([h, ...tail]).canonify();
    }

    getVars(set = new Set<string>()) {
        this.terms.forEach(t => t.getVars(set));
        return set;
    }

}
