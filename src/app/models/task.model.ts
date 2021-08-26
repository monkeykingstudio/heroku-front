export class Task {
  colonyId: string;
  title: string;
  description: string;
  toDo: boolean;
  id?: string;
  parentId?: string;
  automatic?: boolean;
  duration?: number;
  recurent?: boolean;
  every?: string;
  creationDate?: string;
}
