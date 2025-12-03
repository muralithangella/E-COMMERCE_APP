// Clear corrupted localStorage data
export const clearAuthStorage = () => {
  const authKeys = ['accessToken', 'refreshToken', 'user', 'token'];
  authKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  console.log('Auth storage cleared');
};

// Run on app start to clear any corrupted data
if (typeof window !== 'undefined') {
  try {
    // Test if storage is corrupted
    const testKeys = ['accessToken', 'refreshToken', 'user'];
    testKeys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          atob(item);
        } catch {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    clearAuthStorage();
  }
}