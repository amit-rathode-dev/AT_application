import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noData',
  standalone: true
})
export class NoDataPipe implements PipeTransform {

  transform(value: any, defaultText: string ='NA'): string {
      return value !== undefined && value !== null && value !== '' && value !== ' '  ? value : defaultText;
  }

}
