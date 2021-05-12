import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { map, shareReplay } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readMode = new BehaviorSubject<boolean>(true);
  currentReadMode$ = this.readMode.asObservable();

  private tasksUrl = 'http://localhost:3000/api/colonies/tasks';
  constructor(private http: HttpClient) {}

  loadAllTasks(colonyId: string) {
    return this.http.get<Task[]>(`${this.tasksUrl}/${colonyId}`).pipe(
      map(result => result['tasks']),
      shareReplay()
    );
  }

  addTask(task: Task) {
    return this.http.post<Task>(this.tasksUrl, task).pipe(
      shareReplay()
    );
  }

  deleteTask(id: string) {
    return this.http.delete<Task>(`${this.tasksUrl}/${id}`);
  }

  setTaskDone(id: string) {
    return this.http.post<Task>(`${this.tasksUrl}/${id}`, true).pipe(
      shareReplay()
    );
  }

  removeRecurence(id: string) {
    return this.http.post<Task>(`${this.tasksUrl}/job/${id}`, true).pipe(
      shareReplay()
    );
  }

  getMode() {
    return this.currentReadMode$;
  }

  switchMode() {
    const val = this.readMode.getValue();
    return this.readMode.next(!val);
  }

}
