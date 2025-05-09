import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  hasCompletedWizard: boolean;
  [key: string]: any; // Add additional fields as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem("auth_token");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        // Verify token validity
        const response = await fetch(`/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setToken(storedToken);
          setUser(userData.user); // Assuming `user` is returned in the response
          setIsAuthenticated(true);
        } else {
          // Invalid token, clean up
          localStorage.removeItem("auth_token");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (newToken: string) => {
    try {
      // Store the token
      localStorage.setItem("auth_token", newToken);
      setToken(newToken);

      // Fetch user data
      const response = await fetch(`/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Assuming the API returns the user object
        setIsAuthenticated(true);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Login error:", error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValue: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);