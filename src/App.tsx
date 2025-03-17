import { useCallback, useState } from "react";
import { useTodos } from "./hooks/useTodos";
import { TodoInput, TodoList } from "./components";
import { Toaster } from "react-hot-toast";

function App() {
  const [taskInput, setTaskInput] = useState("");

  const { todos, isLoading, addTodo, editTodo, toggleStatus, deleteTodo } = useTodos();

  const handleNewTask = useCallback(() => {
    addTodo(taskInput);
    setTaskInput("");
  }, [addTodo, taskInput]);

  const memoizedToggleStatus = useCallback(
    (id: string) => {
      toggleStatus(id);
    },
    [toggleStatus]
  );

  const memoizedEditTodo = useCallback((id: string, newText: string) => {
    editTodo(id, newText)
  }, [editTodo])

  const memoizedDeleteTodo = useCallback(
    (id: string) => {
      deleteTodo(id);
    },
    [deleteTodo]
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 p-6">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-xl rounded-xl shadow-2xl">
        <div className="rounded-t-xl bg-indigo-700 p-4">
          <h1 className="text-center text-xl font-bold text-white sm:text-2xl md:text-3xl">
            Todo app
          </h1>
        </div>

        <div className="bg-white rounded-b-xl">
          <TodoInput
            taskInput={taskInput}
            handleNewTask={handleNewTask}
            setTaskInput={setTaskInput}
          />

          <TodoList
            todos={todos}
            isLoading={isLoading}
            onToggle={memoizedToggleStatus}
            onEdit={memoizedEditTodo}
            onDelete={memoizedDeleteTodo}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
