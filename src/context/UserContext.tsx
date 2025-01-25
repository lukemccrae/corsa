import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {config, CognitoIdentityCredentials } from 'aws-sdk';

type User = {
  email: string;
  userId: string;
  exp: number;
};

export type Anon = {
  accessKeyId: string;
  expiration: Date;
  sessionToken: string;
  secretAccessKey: string;
};

type UserContextType = {
  user: User | null;
  anon: Anon | undefined;
  checkValidAnon: () => boolean;
  setAnonCreds: () => Promise<void>;
  getAnon: () => Promise<Anon>;
};

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

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [anon, setAnon] = useState<Anon | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);

  // On mount, load credentials from localStorage or fetch fresh ones
  useEffect(() => {
    const localCreds = localStorage.getItem("anon");
    if (localCreds) {
      const parsedAnon: Anon = JSON.parse(localCreds);
      setAnon(parsedAnon);
    }

    if (!checkValidAnon()) {
      retrieveAnon();
    }
  }, []);

  // Check if anonymous credentials are still valid
  const checkValidAnon = (): boolean => {
    if (!anon) return false;
    if (!anon.accessKeyId || !anon.secretAccessKey || !anon.sessionToken) return false;
    return new Date(anon.expiration).getTime() > Date.now();
  };

  // Retrieve new anonymous credentials
  const retrieveAnon = async () => {
    if (!isFetching) {
      await setAnonCreds();
    }
  };

  // Get anonymous credentials, retrieving them if necessary
  const getAnon = async (): Promise<Anon> => {
    if (!checkValidAnon()) {
      await setAnonCreds();
    }
    if (!anon) {
      throw new Error("Failed to retrieve valid anonymous credentials.");
    }
    return anon;
  };

  // Function to fetch anonymous credentials from AWS Cognito
  const getAnonCreds = async (): Promise<AWS.CognitoIdentityCredentials> => {
    const REGION = "us-west-1";
    const IDENTITY_POOL_ID = "us-west-1:85bf7267-2f79-43cc-a053-063c7ee03228";

    config.update({
      region: REGION,
      credentials: new CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID,
      }),
    });

    return new Promise((resolve, reject) => {
      const credentials = config.credentials as AWS.CognitoIdentityCredentials;

      credentials.get((err) => {
        if (err) {
          console.error("Error getting anonymous credentials:", err);
          reject(new Error("Failed to fetch anonymous credentials"));
        } else {
          resolve(credentials);
        }
      });
    });
  };

  // Function to store and set the credentials
  const setAnonCreds = async () => {
    try {
      setIsFetching(true);

      const anonCreds = await getAnonCreds();
      if (
        anonCreds &&
        anonCreds.expireTime &&
        anonCreds.sessionToken &&
        anonCreds.accessKeyId &&
        anonCreds.secretAccessKey
      ) {
        const creds: Anon = {
          expiration: anonCreds.expireTime,
          sessionToken: anonCreds.sessionToken,
          secretAccessKey: anonCreds.secretAccessKey,
          accessKeyId: anonCreds.accessKeyId,
        };

        setAnon(creds);
        localStorage.setItem("anon", JSON.stringify(creds));
      } else {
        throw new Error("Failed to retrieve valid credentials");
      }
    } catch (error) {
      console.error("Error setting anonymous credentials:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, anon, checkValidAnon, setAnonCreds, getAnon }}>
      {children}
    </UserContext.Provider>
  );
};
