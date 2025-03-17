import { act, render, screen } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";
import { mockHandlers } from "../../__mocks__/handlers";
import { TodoInput, TodoItem, TodoList } from "../../components";
import { singleTodo } from "../../__mocks__/todos";

export async function flushPromises(ms = 0): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

export async function fillTaskInput(
  user: UserEvent,
  inputValue: string,
  inputSelector: RegExp = /add a new task/i
): Promise<HTMLElement> {
  const input = screen.getByPlaceholderText(inputSelector);

  await user.clear(input);
  await user.type(input, inputValue);
  await flushPromises();

  return input;
}

export async function clickAddTaskButton(
  user: UserEvent,
  buttonSelector: RegExp = /add task/i
): Promise<HTMLElement> {
  const button = screen.getByRole("button", { name: buttonSelector });

  await user.click(button);
  await flushPromises();

  return button;
}

export type ComponentType = "TodoInput" | "TodoItem" | "TodoList";

export function renderComponent(componentType: ComponentType, props = {}) {
  switch (componentType) {
    case "TodoInput":
      return render(
        <TodoInput
          taskInput=""
          setTaskInput={mockHandlers.setTaskInput}
          handleNewTask={mockHandlers.addTodo}
          {...props}
        />
      );

    case "TodoItem":
      return render(
        <TodoItem
          todo={singleTodo}
          onEdit={mockHandlers.editTodo}
          onToggle={mockHandlers.toggleStatus}
          onDelete={mockHandlers.deleteTodo}
          {...props}
        />
      );

    case "TodoList":
      return render(
        <TodoList
          todos={[]}
          isLoading={false}
          onToggle={mockHandlers.toggleStatus}
          onEdit={mockHandlers.editTodo}
          onDelete={mockHandlers.deleteTodo}
          {...props}
        />
      );

    default:
      throw new Error(`Unknown component type: ${componentType}`);
  }
}
