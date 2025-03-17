import { useCallback, useEffect, useState } from "react";
import { TodosHook, TodoType } from "../types/types";
import { nanoid } from "nanoid";
import {
  retrieveFromLocalStorage,
  saveToLocalStorage,
} from "../utils/localStorage";
import toast from "react-hot-toast";
import { validationMessages } from "../constants/toastValidationMessages";

export function useTodos(): TodosHook {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    const fetchedTodos = await retrieveFromLocalStorage();
    setTodos(fetchedTodos);
    setIsLoading(false);
  }, []);

  function addTodo(todoValue: string) {
    if (!todoValue.trim()) {
      toast.error(validationMessages.EMPTY_TASK);
      return;
    }
    const newTodo: TodoType = {
      id: nanoid(),
      text: todoValue,
      isCompleted: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    toast.success(validationMessages.TASK_ADDED);

    return newTodo;
  }

  function toggleStatus(id: string) {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );

    toast.success(validationMessages.TASK_UPDATED);
  }

  function editTodo(id: string, newText: string) {
    if (!newText.trim()) {
      toast.error(validationMessages.EMPTY_TASK)
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    )
    toast.success(validationMessages.TASK_EDITED)

  }

  function deleteTodo(id: string) {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    toast.success(validationMessages.TASK_DELETED);
  }

  useEffect(() => {
    fetchTodos();
    setIsInitialLoad(false);
  }, [fetchTodos]);

  useEffect(() => {
    if (!isInitialLoad) {
      saveToLocalStorage(todos);
    }
  }, [todos, isInitialLoad]);

  return { todos, isLoading, addTodo, editTodo, toggleStatus, deleteTodo };
}
