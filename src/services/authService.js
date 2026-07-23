import constants from "../common/constants";

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(email, password) {
    const url = `${constants.API.HOST}/users/login`;
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 [AUTH REQUEST] POST', url, { email });
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [AUTH ERROR] POST', url, errorData);
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [AUTH RESPONSE] POST', url, {
          token: data.token ? '[TOKEN_RECEIVED]' : '[NO_TOKEN]',
          user: data.user,
          userIsAdmin: data.user?.isAdmin,
          userObject: JSON.stringify(data.user, null, 2)
        });
      }
      
      // Store token and user data
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [AUTH] User logged in successfully', {
          userId: data.user?.id,
          email: data.user?.email,
          isAdmin: data.user?.isAdmin,
          userKeys: Object.keys(data.user || {}),
          fullUser: data.user
        });
      }

      // Dispatch custom event to notify components of auth state change
      window.dispatchEvent(new CustomEvent('authStateChanged'));

      return data;
    } catch (error) {
      console.error('❌ [AUTH ERROR] Login failed:', error);
      throw error;
    }
  }

  logout() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 [AUTH] Logging out user', {
        currentUser: this.user?.email,
        wasAdmin: this.user?.isAdmin
      });
    }
    
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ [AUTH] User logged out successfully');
    }
    
    // Dispatch custom event to notify components of auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  getCurrentUser() {
    return this.user;
  }

  isAdmin() {
    return this.user?.isAdmin || false;
  }

  getToken() {
    return this.token;
  }

  getAuthHeaders() {
    if (!this.token) {
      return {};
    }
    return {
      'Authorization': `Bearer ${this.token}`,
    };
  }

  async validateToken() {
    if (!this.token) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔍 [AUTH] No token to validate');
      }
      return false;
    }

    const url = `${constants.API.HOST}/users/validate`;
    if (process.env.NODE_ENV !== 'production') {
      console.log('🚀 [AUTH REQUEST] GET', url);
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [AUTH ERROR] GET', url, errorData);
        // Token is invalid, clear it
        this.logout();
        return false;
      }

      const userData = await response.json();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [AUTH RESPONSE] GET', url, {
          user: userData,
          userIsAdmin: userData?.isAdmin,
          userKeys: Object.keys(userData || {}),
          userObject: JSON.stringify(userData, null, 2)
        });
      }
      
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [AUTH] Token validated successfully', {
          userId: userData?.id,
          email: userData?.email,
          isAdmin: userData?.isAdmin,
          fullUser: userData
        });
      }
      
      return true;
    } catch (error) {
      console.error('❌ [AUTH ERROR] Token validation failed:', error);
      this.logout();
      return false;
    }
  }

  // Initialize auth state on app start
  async initialize() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 [AUTH] Initializing auth service', {
        hasToken: !!this.token,
        hasUser: !!this.user,
        userIsAdmin: this.user?.isAdmin
      });
    }
    
    if (this.token) {
      const isValid = await this.validateToken();
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ [AUTH] Initialize result:', { isValid });
      }
      return isValid;
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 [AUTH] No token found, user not authenticated');
    }
    return false;
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;