import { Expression } from './expression';

declare const BigInt: (v: string | number) => bigint;

export class Fraction extends Expression {

    constructor(private numerator: bigint, private denominator: bigint) {
        super();
    }

    isZero() {
        return this.numerator === BigInt(0);
    }

    add(v: Fraction) {
        return new Fraction(this.numerator * v.denominator + this.denominator * v.numerator, this.denominator * v.denominator);
    }

    sub(v: Fraction) {
        return new Fraction(this.numerator * v.denominator - this.denominator * v.numerator, this.denominator * v.denominator);
    }

    isPositive() {
        if (this.numerator > 0 && this.denominator > 0) {
            return true;
        }
        if (this.numerator < 0 && this.denominator < 0) {
            return true;
        }
        return false;
    }

    isNegative() {
        if (this.numerator > 0 && this.denominator < 0) {
            return true;
        }
        if (this.numerator < 0 && this.denominator > 0) {
            return true;
        }
        return false;
    }

    invert() {
        if (this.isZero()) {
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

    toString(sign = true) {
        let v: string;
        if (this.denominator === BigInt(1)) {
            v = this.numerator.toString();
        } else if (this.numerator === BigInt(0)) {
            v = '0';
        } else {
            v = this.numerator + '/' + this.denominator;
        }
        if (!sign && v[0] === '-') {
            return v.substring(1);
        } else {
            return v;
        }
    }

}

export const ONE = new Fraction(BigInt(1), BigInt(1));
export const NEG = new Fraction(BigInt(-1), BigInt(1));
export const ZERO = new Fraction(BigInt(0), BigInt(1));
