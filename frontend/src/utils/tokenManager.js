// Token utility for managing JWT tokens safely

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const ROLE_KEY = 'role';
const EMAIL_KEY = 'email';
const TOKEN_EXPIRY_KEY = 'token_expiry';

/**
 * Decode JWT token to get payload (without verification)
 * Note: This only decodes, doesn't verify. Verification happens server-side.
 */
function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Calculate token expiry time from JWT exp claim
 */
function getTokenExpiry(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return null;
  return payload.exp * 1000; // Convert to milliseconds
}

/**
 * Store token and user data
 */
export function setToken(token, user) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(ROLE_KEY, user.role);
    localStorage.setItem(EMAIL_KEY, user.email);
    
    // Store token expiry time
    const expiry = getTokenExpiry(token);
    if (expiry) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    }
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

/**
 * Get stored token
 */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

/**
 * Get stored user data
 */
export function getUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Get user role
 */
export function getUserRole() {
  try {
    return localStorage.getItem(ROLE_KEY) || 'viewer';
  } catch (error) {
    console.error('Error getting role:', error);
    return 'viewer';
  }
}

/**
 * Get user email
 */
export function getUserEmail() {
  try {
    return localStorage.getItem(EMAIL_KEY) || '';
  } catch (error) {
    console.error('Error getting email:', error);
    return '';
  }
}

/**
 * Check if token is still valid
 */
export function isTokenValid() {
  const token = getToken();
  if (!token) return false;
  
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true; // If no expiry stored, assume valid
    
    const now = Date.now();
    return now < parseInt(expiry);
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
}

/**
 * Check if token is about to expire (within 5 minutes)
 */
export function isTokenExpiringSoon() {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return false;
    
    const now = Date.now();
    const expiryTime = parseInt(expiry);
    const timeUntilExpiry = expiryTime - now;
    const fiveMinutes = 5 * 60 * 1000;
    
    return timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return false;
  }
}

/**
 * Get time until token expiry in seconds
 */
export function getTimeUntilExpiry() {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return null;
    
    const now = Date.now();
    const expiryTime = parseInt(expiry);
    return Math.max(0, Math.floor((expiryTime - now) / 1000));
  } catch (error) {
    console.error('Error getting time until expiry:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  
  // If token is invalid, clean up and return false
  if (!isTokenValid()) {
    clearToken();
    return false;
  }
  
  return true;
}

/**
 * Check if user is admin
 */
export function isAdmin() {
  return getUserRole() === 'admin';
}

/**
 * Clear token and user data
 */
export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
}

/**
 * Setup token expiry listener
 * Calls callback when token is about to expire
 */
export function setupTokenExpiryListener(callback) {
  const checkInterval = setInterval(() => {
    if (!isAuthenticated()) {
      clearInterval(checkInterval);
      if (callback) callback('expired');
    } else if (isTokenExpiringSoon()) {
      if (callback) callback('expiring-soon');
    }
  }, 60000); // Check every minute
  
  return () => clearInterval(checkInterval); // Cleanup function
}
