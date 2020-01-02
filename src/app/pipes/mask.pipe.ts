import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return '';
    value = value.toString();
    const visibleDigits = 4;
    let maskedSection = value.slice(0, -visibleDigits);
    let visibleSection = value.slice(-visibleDigits);
    return maskedSection.replace(/./g, '*') + visibleSection;
  }
}

