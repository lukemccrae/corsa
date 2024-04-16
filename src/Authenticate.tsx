import React, { useState } from "react";
import UserPool from "./UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import jwtdecode from "jwt-decode";

interface AuthenticationProps {
  setUser: Function;
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

        const { email, exp, sub } = decodedToken;
        const userId = sub;

        props.setUser({ email, userId, exp });
      },

      onFailure: function (err) {
        alert(err);
      },
    });
  };

  return (
    <div>
      Register
      <form onSubmit={onSubmitRegister}>
        <label htmlFor="email">Email</label>
        <input
          value={registerEmail}
          onChange={(event) => setRegisterEmail(event.target.value)}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          value={registerPassword}
          onChange={(event) => setRegisterPassword(event.target.value)}
        ></input>
        <button type="submit">Signup</button>
      </form>
      Login
      <form onSubmit={onSubmitLogin}>
        <input
          style={{ color: "black" }}
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
        ></input>
        <label htmlFor="password">Password</label>
        <input
          style={{ color: "black" }}
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
        ></input>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default Authenticate;
