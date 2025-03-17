export interface TodoType {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface TodosHook {
  todos: TodoType[];
  isLoading: boolean;
  addTodo: (text: string) => void;
  toggleStatus: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  deleteTodo: (id: string) => void;
}
