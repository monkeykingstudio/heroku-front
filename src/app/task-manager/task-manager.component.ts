import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasksService } from './../services/tasks.service';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent implements OnInit, OnDestroy {
  @Input()
  colonyId: string;
  mode: Subscription;
  currentMode;
  reload: boolean;

  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
    this.reloadMode();
  }

  reloadMode() {
    this.mode = this.tasksService.getMode().subscribe((mode) => {
      this.currentMode = mode;
    });
  }

  reloadTasks($event) {
    this.reload = true;
  }

  ngOnDestroy(): void {
    this.mode.unsubscribe();
  }

}
