import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwtdecode from "jwt-decode";


type User = {
  email: string;
  userId: string;
  exp: number;
};

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkValidTokenExp: () => boolean;
};

type CognitoToken = {
  aud: string;
  auth_time: number;
  "cognito:username": string;
  email: string;
  email_verified: boolean;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  origin_jti: string;
  sub: string;
  token_use: string;
};

// Create a Context with an initial value of undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to access the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Define props for the UserProvider
type UserProviderProps = {
  children: ReactNode;
};

// UserProvider component to wrap the app and provide the context
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const decodedToken = jwtdecode(storedUser) as CognitoToken;
      const { exp, email, sub } = decodedToken;
      const userId = sub;
      login({email, userId, exp})
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  const checkValidTokenExp = (): boolean => {
    if (user) return user.exp - Date.now() / 1000 > 0;
    return false;
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, checkValidTokenExp, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
