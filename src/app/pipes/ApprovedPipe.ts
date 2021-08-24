
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'approved'
})
export class ApprovedPipe implements PipeTransform{
  transform(data: any[]): any[] {
    return data.filter(data => data.status === 'approved');
  }
}
