import { screen } from "@testing-library/react";
import { mockHandlers, resetMockHandlers } from "../../__mocks__/handlers";
import userEvent, { UserEvent } from "@testing-library/user-event";
import {
  clickAddTaskButton,
  fillTaskInput,
  renderComponent,
} from "../../utils/test-helpers/testUtils";
import toast from "react-hot-toast";
import { validationMessages } from "../../constants/toastValidationMessages";

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
  Toaster: jest.fn().mockReturnValue(null),
}));

describe("TodoInput Component", () => {
  let user: UserEvent;

  beforeEach(() => {
    resetMockHandlers();
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test("should render input field and add task button", async () => {
    renderComponent("TodoInput");

    const inputField = screen.getByPlaceholderText(/add a new task.../i);
    const addTaskButton = screen.getByRole("button", { name: /add task/i });

    expect(inputField).toBeInTheDocument();
    expect(addTaskButton).toBeInTheDocument();
  });

  test("should display the current task input value", async () => {
    const customValue = "Current task";
    renderComponent("TodoInput", { taskInput: customValue });

    const inputField = screen.getByPlaceholderText(/add a new task.../i);
    expect(inputField).toHaveValue(customValue);
  });

  test("should add a new task when add button is clicked", async () => {
    renderComponent("TodoInput");
    const testText = "Buy milk";

    await fillTaskInput(user, testText);
    await clickAddTaskButton(user);

    expect(mockHandlers.addTodo).toHaveBeenCalled();
  });

  test("should add a new task when Enter key is pressed", async () => {
    renderComponent("TodoInput");

    const testText = "Buy milk";

    await fillTaskInput(user, testText);
    await user.keyboard("{Enter}");

    expect(mockHandlers.addTodo).toHaveBeenCalled();
  });

  test("should show error toast when trying to add empty task", async () => {
    const customAddTodo = () => {
      toast.error(validationMessages.EMPTY_TASK);
    };

    renderComponent("TodoInput", { handleNewTask: customAddTodo });

    await clickAddTaskButton(user);

    expect(toast.error).toHaveBeenCalledWith(validationMessages.EMPTY_TASK);
  });

  test("should show successfull toast when add new task", async () => {
    const customAddTodo = () => {
      toast.success(validationMessages.TASK_ADDED);
    };

    renderComponent("TodoInput", { handleNewTask: customAddTodo });

    await clickAddTaskButton(user);

    expect(toast.success).toHaveBeenCalledWith(validationMessages.TASK_ADDED);
  });
});
