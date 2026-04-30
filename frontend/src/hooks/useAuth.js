import { useEffect, useState, useCallback } from 'react';
import {
  getToken,
  getUser,
  isAuthenticated,
  isAdmin,
  clearToken,
  setToken,
  isTokenExpiringSoon,
  setupTokenExpiryListener
} from '../utils/tokenManager.js';

/**
 * Custom hook for managing authentication state
 */
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [tokenExpiringSoon, setTokenExpiringSoon] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const isAuth = isAuthenticated();
    setIsLoggedIn(isAuth);
    
    if (isAuth) {
      const userData = getUser();
      setUser(userData);
      setIsAdminUser(isAdmin());
      setTokenExpiringSoon(isTokenExpiringSoon());
    }
  }, []);

  // Setup token expiry listener
  useEffect(() => {
    const cleanup = setupTokenExpiryListener((status) => {
      if (status === 'expired') {
        logout();
      } else if (status === 'expiring-soon') {
        setTokenExpiringSoon(true);
      }
    });

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = () => {
      const isAuth = isAuthenticated();
      setIsLoggedIn(isAuth);
      
      if (isAuth) {
        const userData = getUser();
        setUser(userData);
        setIsAdminUser(isAdmin());
      } else {
        setUser(null);
        setIsAdminUser(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      cleanup();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = useCallback((token, userData) => {
    setToken(token, userData);
    setIsLoggedIn(true);
    setUser(userData);
    setIsAdminUser(userData.role === 'admin');
    setTokenExpiringSoon(false);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setIsLoggedIn(false);
    setUser(null);
    setIsAdminUser(false);
    setTokenExpiringSoon(false);
  }, []);

  const dismissTokenWarning = useCallback(() => {
    setTokenExpiringSoon(false);
  }, []);

  return {
    isLoggedIn,
    user,
    isAdminUser,
    tokenExpiringSoon,
    login,
    logout,
    dismissTokenWarning,
    token: getToken()
  };
}

/**
 * Custom hook for protected routes
 */
export function useProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const [canAccess, setCanAccess] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      setCanAccess(true);
    } else {
      setCanAccess(false);
    }
  }, [isLoggedIn]);

  return canAccess;
}

/**
 * Custom hook for admin routes
 */
export function useAdminRoute() {
  const { isLoggedIn, isAdminUser } = useAuth();
  const [canAccess, setCanAccess] = useState(null);

  useEffect(() => {
    if (isLoggedIn && isAdminUser) {
      setCanAccess(true);
    } else {
      setCanAccess(false);
    }
  }, [isLoggedIn, isAdminUser]);

  return canAccess;
}
