import { screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { mockHandlers, resetMockHandlers } from "../../__mocks__/handlers";
import { singleTodo, completedTodo } from "../../__mocks__/todos";
import {
  flushPromises,
  renderComponent,
} from "../../utils/test-helpers/testUtils";

describe("TodoItem Component", () => {
  let user: UserEvent;

  beforeEach(() => {
    resetMockHandlers();
    user = userEvent.setup();
  });

  test("should display the todo text correctly", async () => {
    renderComponent("TodoItem");

    const todoText = screen.getByText(singleTodo.text);

    expect(todoText).toBeInTheDocument();
  });

  test("should have unchecked checkbox for incomplete todos", async () => {
    renderComponent("TodoItem");

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
  });

  test("should have checked checkbox for completed todos", async () => {
    renderComponent("TodoItem", { todo: completedTodo });

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  test("should apply line-through style to completed todos", async () => {
    renderComponent("TodoItem", { todo: completedTodo });

    const todoText = screen.getByText(completedTodo.text);

    expect(todoText.className).toContain("line-through");
    expect(todoText.className).toContain("text-gray-400");
  });

  test("should call onToggle with correct id when checkbox is clicked", async () => {
    renderComponent("TodoItem");

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);
    await flushPromises();

    expect(mockHandlers.toggleStatus).toHaveBeenCalledWith(singleTodo.id);
  });

  test("should call onDelete with correct id when delete button is clicked", async () => {
    renderComponent("TodoItem");

    const deleteButton = screen.getByRole("button", { name: /delete/i });

    await user.click(deleteButton);
    await flushPromises();

    expect(mockHandlers.deleteTodo).toHaveBeenCalledWith(singleTodo.id);
  });

  test("should toggle todo status when checkbox is clicked", async () => {
    renderComponent("TodoItem");

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);
    await flushPromises();

    expect(mockHandlers.toggleStatus).toHaveBeenCalledWith(singleTodo.id);
    expect(mockHandlers.toggleStatus).toHaveBeenCalledTimes(1);
  });

  test("should show delete button when hover todo item on desktop", async () => {
    renderComponent("TodoItem");

    const todoItem = screen.getByTestId("todo-item");
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    expect(deleteButton).toHaveClass("sm:invisible");

    await user.hover(todoItem);

    expect(deleteButton).toHaveClass("sm:group-hover:visible");
  });

  test('should be able to edit text when double-clicking on todo text', async () => {
    renderComponent("TodoItem");

    const todoText = screen.getByText(singleTodo.text);
    await user.dblClick(todoText);

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(singleTodo.text)
  })

  test('should update todo text when edit is submitted', async () => {
    renderComponent("TodoItem");

    const todoText = screen.getByText(singleTodo.text);
    await user.dblClick(todoText);

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "New todo text");
    await user.keyboard("{Enter}");
    await flushPromises();

    expect(mockHandlers.editTodo).toHaveBeenCalledWith(singleTodo.id, "New todo text")
  })

  test('should cancel edit mode when pressing Escape key', async () => {
    renderComponent("TodoItem");

    const todoText = screen.getByText(singleTodo.text);
    await user.dblClick(todoText);

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Something else");
    await user.keyboard("{Escape}");
    await flushPromises();

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText(singleTodo.text)).toBeInTheDocument();
    expect(mockHandlers.editTodo).not.toHaveBeenCalled();
  })

  test('should submit new text when clicking outside the input', async () => {
    renderComponent("TodoItem");

    const todoText = screen.getByText(singleTodo.text);
    await user.dblClick(todoText);

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Updated text");

    const listItem = screen.getByTestId("todo-item");
    await user.click(listItem);
    await flushPromises();

    expect(mockHandlers.editTodo).toHaveBeenCalledWith(singleTodo.id, "Updated text");

  })

  test('should not update todo text if new text is empty', async () => {
    renderComponent("TodoItem");

    const todoText = screen.getByText(singleTodo.text);
    await user.dblClick(todoText);

    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.keyboard("{Enter}");
    await flushPromises();

    expect(mockHandlers.editTodo).not.toHaveBeenCalled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText(singleTodo.text)).toBeInTheDocument();
  })
});
