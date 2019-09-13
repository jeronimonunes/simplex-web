import { CanonicalAddition } from './canonical-addition';
import { Equality } from './equality';
import { CanonicalEquality } from './canonical-equality';

export class Fpi {

    constructor(private objective: CanonicalAddition, private restrictions: CanonicalEquality[], private vars: string[]) {

    }

    toString() {
        let result = `max(${this.objective})\n`;
        result += `\tst:\n`;
        for (const restriction of this.restrictions) {
            result += `\t${restriction};\n`;
        }
        result += '\n\t' + this.vars.join(',') + ' >= 0\n';
        return result;
    }

}