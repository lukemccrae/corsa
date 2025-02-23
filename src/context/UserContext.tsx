import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { AwsCredentialIdentity } from "@aws-sdk/types";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../UserPool";
import { CognitoToken } from '../types';
import jwtdecode from "jwt-decode";
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

type User = {
  email: string;
  userId: string;
  exp: number;
  idToken: string;
  preferred_username: string;
};

export type Anon = {
  accessKeyId: string;
  expiration: Date;
  sessionToken: string;
  secretAccessKey: string;
};

type UserContextType = {
  user: User | undefined;
  anon: Anon | undefined;
  checkValidAnon: () => boolean;
  setAnonCreds: () => Promise<void>;
  getAnon: () => Promise<Anon>;
  logoutUser: () => Promise<void>
  loginUser: (event: any) => Promise<void>
  registerUser: (event: any) => Promise<void>
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
  const [user, setUser] = useState<User | undefined>(undefined);
  const [anon, setAnon] = useState<Anon | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);

  // On mount, load credentials from localStorage or fetch fresh ones
  useEffect(() => {
    const localAnonCreds = localStorage.getItem("anon");
    const localUserCreds = localStorage.getItem("user");

    if (localUserCreds) {
      const decodedUser: CognitoToken = jwtdecode(localUserCreds);
      if (checkValidUser(decodedUser)) {
        setUserInStorage(localUserCreds)
      } else {
        localStorage.removeItem("user")
      }
    }

    if (localAnonCreds) {
      const parsedAnon: Anon = JSON.parse(localAnonCreds);
      setAnon(parsedAnon);
    }

    if (!checkValidAnon()) {
      retrieveAnon();
    }
  }, []);

  const logoutUser = async () => {
    console.log("logout user")
  }

  const checkValidUser = (decodedUser: CognitoToken) => {
    if (!decodedUser) return false;
    if (decodedUser.exp < (Date.now() / 1000)) return false
    return true;
  }

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

  const registerUser = async (event: any) => {
    const data = new FormData(event.currentTarget);
    
    const email = data.get('register-email')?.toString();
    const password = data.get('register-password')?.toString()
    console.log(email, password, '< ep')

    if (!email || !password) {
      throw new Error('Your user credentials are invalid')
    }

    console.log(email, password)

    event.preventDefault();
    UserPool.signUp(email, password, [], [], (err, data) => {
      if (err) {
        console.error(err);
      }
      const loginForm = new FormData(event.currentTarget);
      loginForm.set('email', email)
      loginForm.set('password', password)

    });
  };

  const setUserInStorage = (idToken: string) => {
    const decodedToken = jwtdecode(idToken) as CognitoToken;
    const { email, exp, sub, preferred_username } = decodedToken;
    const userId = sub;

    setUser({ email, exp, userId, idToken, preferred_username })
    localStorage.setItem("user", idToken)
  }

  const loginUser = async (event: any) => {
    const data = new FormData(event.currentTarget);

    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString()

    if (!email || !password) {
      throw new Error('Your user credentials are invalid')
    }

    event.preventDefault();
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    var userData = {
      Username: email,
      Pool: UserPool,
    };
    var cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        const idToken = result.getIdToken().getJwtToken()

        // const refreshToken = result.getRefreshToken()
        // TODO store refresh token and perform auto-refresh

        setUserInStorage(idToken)
      },
      onFailure: function (err) {
        console.log(err, "auth failure")
      }
    });
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

  const getAnonCreds = async (): Promise<AwsCredentialIdentity> => {
    const REGION = "us-west-1";
    const IDENTITY_POOL_ID = "us-west-1:85bf7267-2f79-43cc-a053-063c7ee03228";

    const cognitoClient = new CognitoIdentityClient({ region: REGION });

    const credentialsProvider = fromCognitoIdentityPool({
      identityPoolId: IDENTITY_POOL_ID,
      clientConfig: { region: REGION }
    });


    try {
      const credentials = await credentialsProvider();
      return credentials;
    } catch (error) {
      console.error("Error getting anonymous credentials:", error);
      throw new Error("Failed to fetch anonymous credentials");
    }
  };

  // Function to store and set the credentials
  const setAnonCreds = async () => {
    try {
      setIsFetching(true);

      const anonCreds = await getAnonCreds();
      if (
        anonCreds &&
        anonCreds.expiration &&
        anonCreds.sessionToken &&
        anonCreds.accessKeyId &&
        anonCreds.secretAccessKey
      ) {
        const creds: Anon = {
          expiration: anonCreds.expiration,
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
    <UserContext.Provider value={{ user, anon, registerUser, loginUser, checkValidAnon, setAnonCreds, getAnon, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
