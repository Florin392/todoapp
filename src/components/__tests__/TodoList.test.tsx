import { screen } from "@testing-library/react";
import { emptyTodos, multipleTodos, singleTodo } from "../../__mocks__/todos";
import { mockHandlers, resetMockHandlers } from "../../__mocks__/handlers";
import {
  renderComponent,
  flushPromises,
} from "../../utils/test-helpers/testUtils";
import userEvent, { UserEvent } from "@testing-library/user-event";

describe("TodoList Component", () => {
  let user: UserEvent;

  beforeEach(() => {
    resetMockHandlers();
    user = userEvent.setup();
  });

  test("should display loading state when data is being fetched", async () => {
    renderComponent("TodoList", { isLoading: true });

    const loadingMessage = screen.getByText(/loading\.\.\./i);

    expect(loadingMessage).toBeInTheDocument();
  });

  test("should display empty state message when todos is empty", async () => {
    renderComponent("TodoList", { todos: emptyTodos });

    const emptyMessage = screen.getByText(/please add something/i);

    expect(emptyMessage).toBeInTheDocument();
  });

  test("should not display loading or empty state message when todos exist", async () => {
    renderComponent("TodoList", { todos: multipleTodos });
    await flushPromises();

    const loadingMessage = screen.queryByText(/loading\.\.\./i);
    const emptyMessage = screen.queryByText(/please add something/i);

    expect(loadingMessage).not.toBeInTheDocument();
    expect(emptyMessage).not.toBeInTheDocument();
  });

  test("should render all todos items from the list", async () => {
    renderComponent("TodoList", { todos: multipleTodos });
    await flushPromises();

    multipleTodos.forEach((todo) => {
      const todoItem = screen.getByText(todo.text.trim());
      expect(todoItem).toBeInTheDocument();
    });
  });

  test("should render list items based on todos length", async () => {
    renderComponent("TodoList", { todos: multipleTodos });
    await flushPromises();

    const todoItems = screen.getAllByRole("listitem");

    expect(todoItems).toHaveLength(multipleTodos.length);
  });

  test("should remove todo item when delete button is clicked", async () => {
    renderComponent("TodoList", { todos: multipleTodos });

    const deleteButton = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButton[1]);
    await flushPromises();

    expect(mockHandlers.deleteTodo).toHaveBeenCalledWith(multipleTodos[1].id);
  });

  test("should toggle todo completion status when checkbox is clicked", async () => {
    renderComponent("TodoList", { todos: [singleTodo] });

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    await flushPromises();

    expect(mockHandlers.toggleStatus).toHaveBeenCalledWith(singleTodo.id);
  });
});
