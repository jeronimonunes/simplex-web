import { CanonicalRestriction } from './canonical-restriction';

export abstract class Restriction {

    abstract canonify(): CanonicalRestriction;
    abstract getVars(set?: Set<string>): Set<string>;

}
