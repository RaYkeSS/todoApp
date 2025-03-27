export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  deadline?: Date;
  subtasks: SubTask[];
  tags: string[];
  order: number;
  deleted?: boolean;
} 