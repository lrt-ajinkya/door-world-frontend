import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import authService from '../services/authService';

// Custom hook to replace Firebase hooks with API calls
export function useApiData(apiMethod, dependencies = [], options = {}) {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!apiMethod) return;

    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (typeof apiMethod === 'function') {
        result = await apiMethod();
      } else {
        result = await apiService.makeRequest(apiMethod);
      }
      
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
      if (options.onError) {
        options.onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return [data, loading, error, refetch];
}

// Hook for data that should only be fetched once (replaces useCollectionDataOnce)
export function useApiDataOnce(apiMethod, dependencies = []) {
  return useApiData(apiMethod, dependencies);
}

// Hook for single document data (replaces useDocumentDataOnce)
export function useApiDocumentOnce(apiMethod, dependencies = []) {
  return useApiData(apiMethod, dependencies);
}

// Hook for mutations (create, update, delete operations)
export function useApiMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (apiMethod, data = null) => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (typeof apiMethod === 'function') {
        result = await apiMethod(data);
      } else {
        result = await apiService.makeRequest(apiMethod, {
          method: 'POST',
          body: data,
        });
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return [mutate, loading, error];
}

// Specific hooks for common data patterns

export function useCategories() {
  return useApiDataOnce(() => apiService.getCategories());
}

export function useProductsByCategory(categorySlug, language = 'en') {
  return useApiDataOnce(
    () => apiService.getProductsByCategory(categorySlug, language),
    [categorySlug, language]
  );
}

export function useProductsByGroup(group, language = 'en') {
  return useApiDataOnce(
    () => apiService.getProductsByGroup(group, language),
    [group, language]
  );
}

export function useGlazingTypes() {
  return useApiDataOnce(() => apiService.getGlazingTypes());
}

export function useSpecifications(userEmail = null) {
  return useApiDataOnce(
    () => apiService.getSpecifications(userEmail),
    [userEmail]
  );
}

export function useSpecification(specId) {
  return useApiDataOnce(
    () => apiService.getSpecification(specId),
    [specId]
  );
}

export function useDrafts(userEmail = null) {
  return useApiDataOnce(
    () => apiService.getDrafts(userEmail),
    [userEmail]
  );
}

export function useTranslations(language = 'en') {
  return useApiDataOnce(
    () => apiService.translations.getTranslations(language),
    [language]
  );
}

export function useUsers() {
  return useApiDataOnce(() => apiService.fetchUsers());
}

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuthState = useCallback(async () => {
    try {
      setLoading(true);
      const isValid = await authService.initialize();
      if (isValid) {
        setUser(authService.getCurrentUser());
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthState();

    // Listen for storage changes (when login happens in another tab/window)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuthState();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [checkAuthState]);

  return [user, loading, authenticated];
}