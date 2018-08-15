import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getName'
})
export class GetNamePipe implements PipeTransform {

  transform(name: string, lang: string): string {

    if (name === '') {
      return name;
    } else {
      const names = name.split("(");
      if (names.length === 2) {
        if (lang === 'tj') {
          return names[0];
        } else {
          return names[1].replace(")", "");
        }
      } else {
        return names[0];
      }
    }
  }

}
