import { Restriction } from './restriction';
import { Expression } from './expression';

export class Smaller  extends Restriction {

    constructor(private left: Expression, private right: Expression) {
        super();
    }

}
