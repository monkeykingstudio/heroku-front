import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Task } from './../../models/task.model';
import { TasksService } from '../../services/tasks.service';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-task-creator',
  templateUrl: './task-creator.component.html',
  styleUrls: ['./task-creator.component.scss']
})
export class TaskCreatorComponent implements OnInit {
  DATE_FORMAT = 'ddd, DD MMM YYYY';

  @Input()
  currentMode;
  @Input()
  colonyId;

  creationDate: string;
  every = null;

  taskForm: FormGroup;

  allTasks$: Observable<Task[]>;

  @Output()
  taskChanged = new EventEmitter();

  optionsTasks: Array<string> = [
    'cleaning hunting area',
    'cleaning nest',
    'fill water reservoir',
    'relocation of the colony',
    'feeding',
    'nest re-humidification',
    'food preparation',
    'anti escape application',
    'connection pipes check',
    'temperature check / adjustment',
    'humidity check / adjustment',
    'window cleaning'
  ];
  optionsDurations: Array<number> = [
    1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
  ];

  private sub: Subscription;

  constructor(
  private fb: FormBuilder,
  private tasksService: TasksService) { }

  get formControls() { return this.taskForm.controls; }
  get title() { return this.taskForm.controls['title']; }
  get duration() { return this.taskForm.controls['duration']; }
  get description() { return this.taskForm.controls['description']; }
  get recurent() { return this.taskForm.controls['recurent']; }
  get toDo() { return this.taskForm.controls['toDo']; }

  get day() { return this.taskForm.controls['day']; }
  get week() { return this.taskForm.controls['week']; }
  get midMonth() { return this.taskForm.controls['midMonth']; }
  get month() { return this.taskForm.controls['month']; }
  get year() { return this.taskForm.controls['year']; }

  ngOnInit(): void {
    this.prepareForm();
  }

  addTask() {
    const formChanges = this.taskForm.value;

    if (formChanges.day !== false) {
      this.every = 'day';
    } else if (formChanges.week !== false) {
      this.every = 'week';
    } else if (formChanges.midMonth !== false) {
      this.every = '15 days';
    } else if (formChanges.month !== false) {
      this.every = 'month';
    } else if (formChanges.year !== false) {
      this.every = 'year';
    }

    const newTask = {
      colonyId: this.colonyId,
      title: formChanges.title,
      duration: formChanges.duration,
      recurent: formChanges.recurent,
      description: formChanges.description,
      every: this.every !== null ? this.every : null,
      toDo: formChanges.toDo,

    };
    return this.sub = this.tasksService.addTask(newTask).subscribe(() => {
      this.changeMode();
      this.taskChanged.emit();
      this.prepareForm();
    });
  }

  private prepareForm() {
    this.taskForm = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required]}),
      duration: new FormControl(5, { validators: [Validators.required]}),
      description: new FormControl(''),
      recurent: new FormControl(false),
      toDo: new FormControl(false),
      day: new FormControl(false),
      week: new FormControl(false),
      midMonth: new FormControl(false),
      month: new FormControl(false),
      year: new FormControl(false)
    });
  }

  changeMode() {
    return this.tasksService.switchMode();
  }

  OnDestroy() {
    this.sub.unsubscribe;
  }

}
