import { act, renderHook } from "@testing-library/react";
import { resetMockHandlers } from "../../__mocks__/handlers";
import { multipleTodos } from "../../__mocks__/todos";
import {
  retrieveFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/localStorage";
import { useTodos } from "../useTodos";
import { flushPromises } from "../../utils/test-helpers/testUtils";
import { TodoType } from "../../types/types";
import { validationMessages } from "../../constants/toastValidationMessages";
import toast from "react-hot-toast";

jest.mock("../../utils/localStorage", () => ({
  retrieveFromLocalStorage: jest.fn(),
  saveToLocalStorage: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
  Toaster: jest.fn().mockReturnValue(null),
}));

describe("useTodos Hook", () => {
  const mockRetrieve = retrieveFromLocalStorage as jest.Mock;
  const mockSave = saveToLocalStorage as jest.Mock;

  const setupHook = async (initialTodos: TodoType[] = multipleTodos) => {
    mockRetrieve.mockResolvedValue(initialTodos);
    const hookResult = renderHook(() => useTodos());
    await flushPromises();
    return hookResult;
  };
  beforeEach(() => {
    jest.clearAllMocks();
    resetMockHandlers();
    (retrieveFromLocalStorage as jest.Mock).mockResolvedValue(multipleTodos);
  });

  test("should initialize with loading state", async () => {
    mockRetrieve.mockResolvedValue(multipleTodos);
    const { result } = renderHook(() => useTodos());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.todos).toEqual([]);
  });

  test("should fetch todos on initial load", async () => {
    const { result } = await setupHook();

    expect(retrieveFromLocalStorage).toHaveBeenCalledTimes(1);
    expect(result.current.todos).toEqual(multipleTodos);
    expect(result.current.isLoading).toBe(false);
  });

  test("should add a new todo when addTodo is called with valid text", async () => {
    const { result } = await setupHook([]);

    const todoText = "New Todo";
    act(() => {
      result.current.addTodo(todoText);
    });
    await flushPromises();

    const todos = result.current.todos;
    const newTodo = todos[0];

    expect(todos).toHaveLength(1);
    expect(newTodo).toEqual(
      expect.objectContaining({
        text: todoText,
        isCompleted: false,
        id: expect.any(String),
      })
    );

    expect(mockSave).toHaveBeenCalledWith(todos);
  });

  test('should edit todo text when editTodo is called with valid text', async () => {
    const { result } = await setupHook();

    const originalTodoText = multipleTodos[0];
    const updatedTodoText = "Updated todo text";

    act(() => {
      result.current.editTodo(originalTodoText.id, updatedTodoText);
    });
    await flushPromises();

    const updatedTodo = result.current.todos.find(t => t.id === originalTodoText.id);

    expect(updatedTodo).toBeDefined();
    expect(updatedTodo?.text).toBe(updatedTodoText);
    expect(toast.success).toHaveBeenCalledWith(validationMessages.TASK_EDITED);
    expect(mockSave).toHaveBeenCalledWith(result.current.todos)
  })

  test('should handle editing a non-existing todo id', async () => {
    const { result } = await setupHook();

    const nonExistentId = "non-existent-id";
    const updatedText = "Updated text";

    const initialLength = result.current.todos.length;

    act(() => {
      result.current.editTodo(nonExistentId, updatedText);
    });
    await flushPromises();

    expect(result.current.todos.length).toBe(initialLength);
    expect(toast.success).toHaveBeenCalledWith(validationMessages.TASK_EDITED)

  })
});
