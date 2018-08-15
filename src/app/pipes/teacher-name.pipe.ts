import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teacherName'
})
export class TeacherNamePipe implements PipeTransform {

  transform(fio: string): string {
    if (fio === '') {
      return fio;
    } else {
      const arr = fio.split(" ");
      const surname = arr[0];

      let name = '';
      if (arr[1]) {
        name = arr[1][0] + '.';
      }

      let firstName = '';
      if (arr[2]) {
        firstName = arr[2][0] + '.';
      }

      return surname + ' ' + name + firstName;
    }
  }

}
