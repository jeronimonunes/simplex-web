import { Expression } from './expression';

export class Factor extends Expression {

    constructor(private expr: Expression) {
        super();
    }

    canonify() {
        return this.expr.canonify();
    }

    getVars(set: Set<string>) {
        return this.expr.getVars(set);
    }

    invert() {
        return this.expr.invert();
    }
}
