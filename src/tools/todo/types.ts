export enum TodoStatus {
  pending = 'pending',
  in_progress = 'in_progress',
  completed = 'completed',
  cancelled = 'cancelled',
}

export enum TodoPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export interface TodoItem {
  id: string;
  content: string;
  status: TodoStatus;
  priority: TodoPriority;
  created_at?: number;
}
