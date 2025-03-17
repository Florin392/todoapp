import { memo } from "react";
import { TodoType } from "../types/types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: TodoType[];
  isLoading: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}
function TodoList({ todos, isLoading, onToggle, onEdit, onDelete }: TodoListProps) {
  return (
    <div className="px-4 pb-4 sm:px-6">
      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <p>Please add something</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(TodoList);
