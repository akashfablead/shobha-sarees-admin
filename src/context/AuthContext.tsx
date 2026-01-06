import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { login as apiLogin, getProfile } from "../services/authService";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token by fetching user profile
          const userData = await getProfile();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user profile", error);

          // Only remove token if it's specifically an unauthorized error (401)
          // This prevents removing valid tokens due to temporary network issues
          const status = error?.response?.status;

          if (status === 401) {
            console.log("Token is invalid (401), removing from storage");
            localStorage.removeItem("token");
          } else {
            console.log("Network error or other issue, keeping token");
            console.log("Error details:", {
              status: status,
              message: error?.message || "Unknown error",
              hasResponse: !!error?.response,
              hasRequest: !!error?.request,
            });

            // For network errors (no response), server errors, or other issues, keep the token
            // The user will be prompted to log in again when they try to make authenticated API calls
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call the API login function
      const response = await apiLogin({ email, password });

      if (response.success && response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // Set user data
        setUser(response.data.user);

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
