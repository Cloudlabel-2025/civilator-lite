import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// Define user details type based on usage
interface UserDetails {
  onboarding_status?: string | number;
  [key: string]: any; // fallback for extra properties
}

interface AuthContextType {
  isAuthenticated: boolean;
  OnboardCompleted: boolean;
  login: (access_token: string, userdetails: string) => void;
  logout: () => void;
}

// Create context with explicit type or null
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("access_token") != null
  );
  const [OnboardCompleted, setOnboardCompleted] = useState<boolean>(false);

  const navigate = useNavigate();

  const login = (access_token: string, userdetails: any) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("userdetails", JSON.stringify(userdetails));
    localStorage.removeItem("login-email");

    setIsAuthenticated(true);
    setOnboardCompleted(userdetails.onboarding_status == "1");

    return navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userdetails");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("userdetails");
  //   if (storedUser) {
  //     const UserDetails: UserDetails = JSON.parse(storedUser);
  //     const onboardCompleted = UserDetails.onboarding_status == "1";

  //     setOnboardCompleted(onboardCompleted);

  //     if (isAuthenticated && !onboardCompleted) {
  //       navigate("/get-started");
  //     }
  //   }
  // }, [isAuthenticated, navigate]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, OnboardCompleted, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
