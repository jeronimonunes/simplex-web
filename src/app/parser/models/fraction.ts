import { Expression } from './expression';

declare const BigInt: (v: string | number) => bigint;

export class Fraction extends Expression {

    constructor(private numerator: bigint, private denominator: bigint) {
        super();
    }

    add(v: Fraction) {
        return new Fraction(this.numerator * v.denominator + this.denominator * v.numerator, this.denominator * v.denominator);
    }

    invert() {
        if (this.numerator === BigInt(0)) {
            // tslint:disable-next-line: no-use-before-declare
            return ZERO;
        } else {
            return new Fraction(this.denominator, this.numerator);
        }
    }

    multiply(v: Fraction) {
        return new Fraction(this.numerator * v.numerator, this.denominator * v.denominator);
    }

    getVars(set = new Set<string>()) {
        return set;
    }

    canonify() {
        return this;
    }

}

export const ONE = new Fraction(BigInt(1), BigInt(1));
export const NEG = new Fraction(BigInt(-1), BigInt(1));
export const ZERO = new Fraction(BigInt(0), BigInt(1));
