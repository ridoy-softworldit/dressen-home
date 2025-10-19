interface PersistStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const createNoopStorage = (): PersistStorage => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem: async (key: string): Promise<string | null> => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem: async (key: string, value: string): Promise<void> => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (key: string): Promise<void> => {},
});

const createBrowserStorage = (): PersistStorage => {
  // Server-side rendering (Next.js) - return no-op storage
  if (typeof window === "undefined") {
    return createNoopStorage();
  }

  // Client-side - use localStorage directly
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },

    setItem: async (key: string, value: string): Promise<void> => {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {}
    },

    removeItem: async (key: string): Promise<void> => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {}
    },
  };
};

const persistStorage: PersistStorage = createBrowserStorage();
export default persistStorage;
