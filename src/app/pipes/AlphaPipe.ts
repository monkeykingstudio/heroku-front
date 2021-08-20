
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'alphabetical'
})
export class AlphaPipe implements PipeTransform{
  transform(data: any[]): any[] {
    console.log('data', data);
    data.sort((a: any, b: any) => {
      if (a.species < b.species) {
        return -1;
      }
      if (a.species > b.species) {
        return 1;
      }
      return 0;
  });
  return data;
  }
}
