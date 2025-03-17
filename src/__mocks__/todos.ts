import { TodoType } from "../types/types";

export const singleTodo: TodoType = {
  id: "g-OVJ6AJFi568t9TVm-wT",
  text: "this is a todo mock.",
  isCompleted: false,
};

export const completedTodo: TodoType = {
  id: "2U5qFD7AEfENsJIFXgEtN",
  text: "another mock.",
  isCompleted: true,
};

export const emptyTodos: TodoType[] = [];

export const multipleTodos: TodoType[] = [
  {
    id: "g-OVJ6AJFi568t9TVm-wT",
    text: "this is a todo mock",
    isCompleted: false,
  },

  { id: "2U5qFD7AEfENsJIFXgEtN", text: "another mock", isCompleted: true },
];

export const createTodo = (
  id: string = "generated-id",
  text: string = "Generated todo",
  isCompleted: boolean = false
): TodoType => ({
  id,
  text,
  isCompleted,
});
