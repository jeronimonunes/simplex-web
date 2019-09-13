import { CanonicalEquality } from './canonical-equality';

export abstract class CanonicalRestriction {

    abstract isNonNegativity(): boolean;

    abstract turnIntoEquality(positiveVars: Set<string>): CanonicalEquality;

}
