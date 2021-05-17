import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Colony } from './../colony.model';
import { Router } from '@angular/router';
import { ColoniesService } from './../../services/colonies.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-colony-card',
  templateUrl: './colony-card.component.html',
  styleUrls: ['./colony-card.component.scss']
})
export class ColonyCardComponent implements OnInit {
  @Input()
  colony: Colony;
  bubbleTools = false;

  @Output()
  colonyChange = new EventEmitter();

  constructor(public coloniesService: ColoniesService, public router: Router) { }

  ngOnInit(): void {
  }

  switchBubbles() {
    this.bubbleTools = !this.bubbleTools;
  }

  openColony(colony): void {
    const colonyID = colony.id;
    this.router.navigate (['colonies', colonyID]);
  }

  deleteColony(colonyId: string) {
    this.coloniesService.deleteColony(colonyId)
    .pipe(
      tap(() => this.colonyChange.emit())
    )
    .subscribe(() => {
      console.log('colony deleted');
    });
  }

}
