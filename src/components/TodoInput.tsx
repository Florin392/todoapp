import { memo, useCallback } from "react";

interface TodoInputProp {
  taskInput: string;
  setTaskInput: (value: string) => void;
  handleNewTask: () => void;
}

function TodoInput({ taskInput, setTaskInput, handleNewTask }: TodoInputProp) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleNewTask();
      }
    },
    [handleNewTask]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTaskInput(e.target.value);
    },
    [setTaskInput]
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          placeholder="Add a new task..."
          id="todo-input"
          value={taskInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none sm:text-base"
        />
        <button
          id="add-task"
          onClick={handleNewTask}
          className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:px-4 sm:text-base"
        >
          Add task
        </button>
      </div>
    </div>
  );
}

export default memo(TodoInput);
