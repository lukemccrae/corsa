import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwtdecode from "jwt-decode";
import AWS from 'aws-sdk';



type User = {
  email: string;
  userId: string;
  exp: number;
};

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  checkAnonStatus: () => boolean;
  login: (userData: User) => void;
  loginAnon: () => void;
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
  const [isMobile, setIsMobile] = useState(false);
  const [isAnon, setIsAnon] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const decodedToken = jwtdecode(storedUser) as CognitoToken;
      const { exp, email, sub } = decodedToken;
      const userId = sub;
      login({ email, userId, exp })
      setIsLoggedIn(true);
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const mobileRegex = /android|iphone|ipad|ipod|blackberry|windows phone/;
    setIsMobile(mobileRegex.test(userAgent));

  }, []);

  const checkAnonStatus = () => {
    console.log(isAnon, '<< isAnon')
    return isAnon;
  };

  const loginAnon = () => {
    const REGION = 'us-west-1';
    const IDENTITY_POOL_ID = 'us-west-1:85bf7267-2f79-43cc-a053-063c7ee03228';

    AWS.config.update({
      region: REGION,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID,
      }),
    });
    if (AWS.config.credentials) {
      const credentials = AWS.config.credentials as AWS.CognitoIdentityCredentials;
      // Fetch anonymous credentials
      credentials.get((err) => {
        if (err) {
          console.error('Error getting anonymous credentials:', err);
        } else {
          console.log('Anonymous Identity ID:', credentials.identityId);
          setIsAnon(true)
          const { accessKeyId, secretAccessKey, sessionToken } = credentials;

          // Set the AWS SDK credentials globally
          // THESE CREDS MAYBE OPEN AND DANGROUS
          // LOCK THEM DOWN
          AWS.config.update({
            accessKeyId,
            secretAccessKey,
            sessionToken,
          });

          console.log(sessionToken, "hsessionToken")
          console.log(secretAccessKey, "secretAccessKey")

          console.log(accessKeyId, "accessKeyId")

        }
      });
    }

  }

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    setIsAnon(false)
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    loginAnon();
  };

  const checkValidTokenExp = (): boolean => {
    console.log(user, 'user')
    if (user) return user.exp - Date.now() / 1000 > 0;
    return false;
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, checkValidTokenExp, login, loginAnon, logout, checkAnonStatus }}>
      {children}
    </UserContext.Provider>
  );
};
