import * as React from "react";
import { baseUrl, tokenKey } from "../constants";

interface SignupCredentials {
  email: string;
  password: string;
}

interface SignupResponse {
  token: string;
}

interface ErrorResponse {
  errors: string | string[];
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
}>({
  isAuthenticated: false,
  login: async () => Promise.resolve(),
  logout: () => {},
  signup: async () => Promise.resolve(),
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const savedToken = getToken();

    if (savedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  function setToken(token: string) {
    window.localStorage.setItem(tokenKey, token);
  }

  function getToken() {
    return window.localStorage.getItem(tokenKey);
  }

  function removeToken() {
    window.localStorage.removeItem(tokenKey);
  }

  async function login(email: string, password: string): Promise<void> {
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify({ email, password } as SignupCredentials),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${baseUrl}/login`, options);

    if (!response.ok) {
      const body: ErrorResponse = await response.json();
      const error =
        body.errors instanceof Array ? body.errors.join(", ") : body.errors;
      throw new Error(error);
    }

    const { token }: SignupResponse = await response.json();
    setToken(token);
    setIsAuthenticated(true);
  }

  async function signup(email: string, password: string): Promise<void> {
    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify({ email, password } as SignupCredentials),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`${baseUrl}/signup`, options);

    if (!response.ok) {
      const body: ErrorResponse = await response.json();
      const error =
        body.errors instanceof Array ? body.errors.join(", ") : body.errors;
      throw new Error(error); // Lanzamos el error
    }

    const { token }: SignupResponse = await response.json();
    setToken(token);
    setIsAuthenticated(true);
  }

  function logout() {
    removeToken();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
