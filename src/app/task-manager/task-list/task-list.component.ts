import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from 'src/app/models/task.model';
import { TasksService } from './../../services/tasks.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input()
  colonyId;

  @Input()
  currentMode;

  @Input()
  reload;

  showToDo: boolean = true;
  expanded: boolean = false;

  allTasks$: Observable<Task[]>;

  doneTasks$: Observable<Task[]>;
  toDoTasks$: Observable<Task[]>;


  constructor(private tasksService: TasksService) { }

  ngOnInit(): void {
    this.reloadTasks();
  }

  ngOnChanges() {
    if (this.reload) {
      this.reloadTasks();
    }
  }

  $deleted($event) {
    this.reloadTasks();
  }

  $done($event) {
    this.reloadTasks();
  }

  $recurence($event) {
    this.reloadTasks();
  }

  reloadTasks(): void {
    const tasks$ = this.tasksService.loadAllTasks(this.colonyId);
    this.toDoTasks$ = tasks$
    .pipe(
      map(tasks => tasks.filter(task => task.toDo === true))
    );
    this.doneTasks$ = tasks$
    .pipe(
      map(tasks => tasks.filter(task => task.toDo === false))
    );
    this.allTasks$ = tasks$;
  }


  changeMode() {
    return this.tasksService.switchMode();
    if (!this.showToDo) {
      this.showToDo = true;
    }
  }

  expandList() {
    return this.expanded = !this.expanded;
  }

  switchShowTodo() {
    this.reloadTasks();
    return this.showToDo = !this.showToDo;
  }
}
