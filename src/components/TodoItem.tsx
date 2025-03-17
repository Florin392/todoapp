import { memo, useCallback, useEffect, useRef, useState } from "react";
import { TodoType } from "../types/types";
interface TodoItemProps {
  todo: TodoType;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
}

function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditText(todo.text);
  }, [todo])

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  }, [])

  const handleEditSubmit = useCallback(() => {
    if (editText.trim() !== "") {
      onEdit(todo.id, editText.trim());
      setIsEditing(false)
    } else {
      setEditText(todo.text);
      setIsEditing(false)
    }
  }, [editText, onEdit, todo])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setEditText(todo.text);
      setIsEditing(false)
    }
  }, [todo, handleEditSubmit])

  return (
    <li
      data-testid="todo-item"
      className="group rounded-lg bg-gray-100 p-2 transition-all hover:bg-gray-200 sm:p-3"
    >
      <div className="flex justify-between sm:items-center w-full">
        <div className="flex items-center w-full min-w-0 mr-2">
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => onToggle(todo.id)}
            className="mr-2 h-4 w-4 cursor-pointer flex-shrink-0 sm:mr-3 sm:h-5 sm:w-5"
          />

          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={handleEditChange}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              className="w-full text-sm text-gray-800 border-b border-indigo-500 bg-transparent focus:outline-none sm:text-base overflow-hidden text-ellipsis"
            />
          ) : (
            <span
              className={`w-full text-sm text-gray-800 sm:text-base overflow-hidden text-ellipsis ${todo.isCompleted ? "line-through text-gray-400" : ""
                }`}
              onDoubleClick={handleDoubleClick}
            >
              {todo.text}
            </span>
          )}
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          className="ml-2 h-auto flex-shrink-0 self-center rounded-md px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-300 sm:invisible sm:text-sm sm:group-hover:visible"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default memo(TodoItem);
