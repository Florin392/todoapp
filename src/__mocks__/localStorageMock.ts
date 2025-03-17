export const createMockLocalStorage = (
  initialData: Record<string, string> = {}
) => {
  let store: Record<string, string> = { ...initialData };

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),

    __setState: (newState: Record<string, string>) => {
      store = { ...newState };
    },
  };
};
