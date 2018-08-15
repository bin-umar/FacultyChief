import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'educationYear'
})
export class EducationYearPipe implements PipeTransform {

  transform(year: number): string {
    return '20' + year + '/' + (+year + 1);
  }

}
