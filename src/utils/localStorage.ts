import { TodoType } from "../types/types";

const STORAGE_KEY = "todos";

export const saveToLocalStorage = (todos: TodoType[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error("Failed to save todos: ", error);
  }
};

export const retrieveFromLocalStorage = async (): Promise<TodoType[]> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const todos = data ? (JSON.parse(data) as TodoType[]) : [];

    return new Promise((resolve) => {
      setTimeout(() => resolve(todos), 1000);
    });
  } catch (error) {
    console.error("Failed to retrieve todos: ", error);
    return [];
  }
};
