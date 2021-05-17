import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { TasksService } from './../../services/tasks.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input()
  task: Task;

  @Output()
  taskDeleted = new EventEmitter();
  @Output()
  taskDone = new EventEmitter();
  @Output()
  taskRecurence = new EventEmitter();

  backOutRight: boolean = false;
  zoomOut: boolean = false;
  recurenceRemove: boolean = false;


  constructor(public tasksService: TasksService) {}

  ngOnInit(): void {
  }

  delete() {
    console.log(this.task.id);
    this.zoomOut = true;
    setTimeout(
    () => {
      return this.tasksService.deleteTask(this.task.id)
      .subscribe((res) => {
        this.taskDeleted.emit(res);
      });
    }, 500);
  }

  done() {
    this.backOutRight = true;
    setTimeout(
      () => {
      return this.tasksService.setTaskDone(this.task.id)
      .subscribe((res) => {
        this.taskDone.emit(res);
      });
    }, 500);
  }

  switchRecurence() {
    this.recurenceRemove = true;
    setTimeout(
      () => {
    return this.tasksService.removeRecurence(this.task.id)
    .subscribe((res) => {
      this.taskRecurence.emit(res);
      console.log('recurence removed with success!');
    });
    }, 500);
  }
}
