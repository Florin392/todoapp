export const mockHandlers = {
  addTodo: jest.fn(),
  toggleStatus: jest.fn<void, [string]>(),
  editTodo: jest.fn<void, [string, string]>(),
  deleteTodo: jest.fn<void, [string]>(),
  setTaskInput: jest.fn(),
};

export const resetMockHandlers = () => {
  Object.values(mockHandlers).forEach((handler) => handler.mockClear());
};

export const mockLocalStorage = {
  saveToLocalStorage: jest.fn(),
  retrievefromLocalStorage: jest.fn(),
};

export const mockNanoId = {
  nanoid: () => "mocked-nano-id",
};

export const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  update: jest.fn(),
  Toaster: jest.fn().mockReturnValue(null),
};

export const resetAllMocks = () => {
  resetMockHandlers();
  Object.values(mockLocalStorage).forEach((mock) => mock.mockClear());
  Object.values(mockToast).forEach((mock) =>
    mock.mockClear ? mock.mockClear() : null
  );
};

