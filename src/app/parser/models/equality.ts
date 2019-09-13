import { Expression } from './expression';
import { Restriction } from './restriction';

export class Equality  extends Restriction {

    constructor(private left: Expression, private right: Expression) {
        super();
    }

}
