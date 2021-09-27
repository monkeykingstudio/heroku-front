import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByDate'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const sortedValues = value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sortedValues;
  }

}
