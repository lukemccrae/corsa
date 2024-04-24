import { useState } from "react";
import UserPool from "./UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import jwtdecode from "jwt-decode";
import {
  Box,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from "@mui/material";

interface AuthenticationProps {
  setUser: Function;
  isLoggedIn: Boolean;
  setIsLoggedIn: Function;
}

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

export const Authenticate = (props: AuthenticationProps) => {
  const [loginEmail, setLoginEmail] = useState("w33ble@gmail.com");
  const [loginPassword, setLoginPassword] = useState("Eeeee4444$$$$");
  const [needToRegister, setNeedToRegister] = useState(false);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const onSubmitRegister = (event: any) => {
    event.preventDefault();

    UserPool.signUp(registerEmail, registerPassword, [], [], (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log(data);
    });
  };

  const onSubmitLogin = (event: any) => {
    event.preventDefault();
    const authenticationDetails = new AuthenticationDetails({
      Username: loginEmail,
      Password: loginPassword,
    });
    var userData = {
      Username: loginEmail,
      Pool: UserPool,
    };
    var cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        // const idTokenPayload = result.idToken.payload;

        const idToken = result.getIdToken().getJwtToken();
        const decodedToken = jwtdecode(idToken) as CognitoToken;
        console.log(idToken, "<< idToken");

        const { email, exp, sub } = decodedToken;
        const userId = sub;

        props.setUser({ email, userId, exp });
        props.setIsLoggedIn(true);
      },

      onFailure: function (err) {
        alert(err);
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {needToRegister ? (
        <div>
          <form onSubmit={onSubmitRegister}>
            Register
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="my-email-input">Email address</InputLabel>
              <Input
                value={registerEmail}
                onChange={(event) => setRegisterEmail(event.target.value)}
                id="my-email-input"
                aria-describedby="my-helper-text"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="my-password-input">Password</InputLabel>
              <Input
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
                id="my-password-input"
                aria-describedby="my-helper-text"
              />
            </FormControl>
            <button type="submit">Register</button>
          </form>
          <button
            onClick={() => {
              setNeedToRegister(false);
            }}
          >
            I have an account
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={onSubmitLogin}>
            Login
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="my-email-input">Email address</InputLabel>
              <Input
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                id="my-email-input"
                aria-describedby="my-helper-text"
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="my-password-input">Password</InputLabel>
              <Input
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                id="my-password-input"
                aria-describedby="my-helper-text"
              />
            </FormControl>
            <button type="submit">Sign in</button>
          </form>
          <button
            onClick={() => {
              setNeedToRegister(true);
            }}
          >
            Need to register
          </button>
        </div>
      )}

      {/* <label htmlFor="email">Email</label>
        <input
          value={registerEmail}
          onChange={(event) => setRegisterEmail(event.target.value)}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          value={registerPassword}
          onChange={(event) => setRegisterPassword(event.target.value)}
        ></input>
        <button type="submit">Signup</button> */}
    </Box>
  );
};

export default Authenticate;
