// Import testing libraries
import '@testing-library/jest-dom';

// Add any global setup or mocks here
// For example, to mock localStorage:
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// This makes this file a proper module
export {};