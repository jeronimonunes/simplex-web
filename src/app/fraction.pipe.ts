import { Pipe, PipeTransform } from '@angular/core';
import { NativeFraction } from 'src/native/simplex';

@Pipe({
  name: 'fraction'
})
export class FractionPipe implements PipeTransform {

  transform(value: NativeFraction): any {
    if (value.denominator === '1') {
      return value.numerator;
    } else if (value.numerator === '0') {
      return '0';
    } else {
      return value.numerator + '/' + value.denominator;
    }
    return null;
  }

}
