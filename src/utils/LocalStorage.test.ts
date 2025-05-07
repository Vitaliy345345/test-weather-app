import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
} from './LocalStorage';

describe('localStorage utilities', () => {
  let localStorageMock: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
  };

  beforeEach(() => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    jest.clearAllMocks();
  });

  describe('saveToLocalStorage', () => {
    test('saves data to localStorage', () => {
      const key = 'testKey';
      const data = { name: 'Test', id: 123 };

      saveToLocalStorage(key, data);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(data),
      );
    });

    test('handles errors when saving to localStorage', () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();

      const error = new Error('localStorage error');
      localStorageMock.setItem.mockImplementation(() => {
        throw error;
      });

      saveToLocalStorage('testKey', { data: 'test' });

      expect(console.error).toHaveBeenCalledWith(
        'Error saving to localStorage:',
        error,
      );

      console.error = originalConsoleError;
    });
  });

  describe('loadFromLocalStorage', () => {
    test('loads and parses data from localStorage', () => {
      const key = 'testKey';
      const data = { name: 'Test', id: 123 };
      const serializedData = JSON.stringify(data);

      localStorageMock.getItem.mockReturnValue(serializedData);

      const result = loadFromLocalStorage(key);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(result).toEqual(data);
    });

    test('returns null when key not found', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = loadFromLocalStorage('nonExistentKey');

      expect(result).toBeNull();
    });

    test('handles parsing errors', () => {
      const originalConsoleError = console.error;
      console.error = jest.fn();

      localStorageMock.getItem.mockReturnValue('invalid JSON');

      const result = loadFromLocalStorage('testKey');

      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();

      console.error = originalConsoleError;
    });
  });

  describe('removeFromLocalStorage', () => {
    test('removes data from localStorage', () => {
      const key = 'testKey';

      removeFromLocalStorage(key);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
    });

    test('handles errors when removing from localStorage', () => {
      // Mock console.error
      const originalConsoleError = console.error;
      console.error = jest.fn();

      const error = new Error('localStorage error');
      localStorageMock.removeItem.mockImplementation(() => {
        throw error;
      });

      removeFromLocalStorage('testKey');

      expect(console.error).toHaveBeenCalledWith(
        'Error removing from localStorage:',
        error,
      );

      console.error = originalConsoleError;
    });
  });
});
