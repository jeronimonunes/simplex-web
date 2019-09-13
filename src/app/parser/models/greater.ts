import { Expression } from '@angular/compiler';
import { Restriction } from './restriction';

export class Greater extends Restriction {

    constructor(private left: Expression, private right: Expression) {
        super();
    }

}
