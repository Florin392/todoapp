import { saveToLocalStorage, retrieveFromLocalStorage } from "../localStorage";
import { createMockLocalStorage } from "../../__mocks__/localStorageMock";
import { singleTodo, multipleTodos } from "../../__mocks__/todos";
import { TodoType } from "../../types/types";

const STORAGE_KEY = "todos";

describe("localStorage Utils", () => {
  let originalLocalStorage: Storage;
  let mockStorage: ReturnType<typeof createMockLocalStorage>;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;

    mockStorage = createMockLocalStorage();

    Object.defineProperty(window, "localStorage", {
      value: mockStorage,
      writable: true,
    });

    consoleSpy = jest.spyOn(console, "error").mockImplementation();

    jest.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      writable: true,
    });

    consoleSpy.mockRestore();
  });

  describe("saveToLocalStorage", () => {
    test("should save todos to localStorage using correct key", async () => {
      const todosToSave: TodoType[] = multipleTodos;

      saveToLocalStorage(todosToSave);

      const setItemMock = mockStorage.setItem;
      const setItemArgs = setItemMock.mock.calls[0];

      expect(setItemMock).toHaveBeenCalled();
      expect(setItemArgs[0]).toBe(STORAGE_KEY);
      expect(setItemArgs[1]).toBe(JSON.stringify(todosToSave));
    });

    test("should save empty array to localStorage when no todos exist", async () => {
      const emptyTodos: TodoType[] = [];

      saveToLocalStorage(emptyTodos);

      const setItemMock = mockStorage.setItem;
      const setItemArgs = setItemMock.mock.calls[0];

      expect(setItemMock).toHaveBeenCalled();
      expect(setItemArgs[0]).toBe(STORAGE_KEY);
      expect(setItemArgs[1]).toBe(JSON.stringify(emptyTodos));
    });

    test("should handle storage errors gracefully", async () => {
      mockStorage.setItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      saveToLocalStorage(multipleTodos);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save todos: ",
        expect.any(Error)
      );
    });
  });

  describe("retrieveFromLocalStorage", () => {
    test("should retrieve todos from localStorage using correct key", async () => {
      mockStorage.getItem.mockReturnValueOnce(JSON.stringify(multipleTodos));

      const todos = await retrieveFromLocalStorage();

      const getItemMock = mockStorage.getItem;
      const getItemArgs = getItemMock.mock.calls[0];

      expect(todos).toEqual(multipleTodos);
      expect(getItemMock).toHaveBeenCalled();
      expect(getItemArgs[0]).toBe(STORAGE_KEY);
    });

    test("should return empty array when localStorage is empty", async () => {
      mockStorage.getItem.mockReturnValueOnce(null);

      const todos = await retrieveFromLocalStorage();

      expect(todos).toEqual([]);
    });

    test("should include simulated loading delay", async () => {
      mockStorage.getItem.mockReturnValueOnce(JSON.stringify(singleTodo));

      const startTime = Date.now();
      await retrieveFromLocalStorage();
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(900);
    });

    test("should handle storage errors gracefully and return empty array", async () => {
      mockStorage.getItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      const todos = await retrieveFromLocalStorage();
      const errorLog = consoleSpy.mock.calls[0];

      expect(todos).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      expect(errorLog[0]).toBe("Failed to retrieve todos: ");
      expect(errorLog[1]).toBeInstanceOf(Error);
    });

    test("should parse different data structures correctly", async () => {
      mockStorage.getItem.mockReturnValueOnce(JSON.stringify([singleTodo]));

      let todos = await retrieveFromLocalStorage();
      expect(todos).toEqual([singleTodo]);

      mockStorage.getItem.mockReturnValueOnce(JSON.stringify(multipleTodos));

      todos = await retrieveFromLocalStorage();
      expect(todos).toEqual(multipleTodos);

      mockStorage.getItem.mockReturnValueOnce(JSON.stringify([]));

      todos = await retrieveFromLocalStorage();
      expect(todos).toEqual([]);
    });

    test("should handle malformed JSON data and return empty array", async () => {
      mockStorage.getItem.mockReturnValueOnce("not valid json");

      const todos = await retrieveFromLocalStorage();

      expect(todos).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toBe("Failed to retrieve todos: ");
      expect(consoleSpy.mock.calls[0][1]).toBeInstanceOf(Error);
    });
  });
});