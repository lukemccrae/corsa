import { useState } from "react";
import UserPool from "./UserPool";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import jwtdecode from "jwt-decode";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  Container,
  Input,
  InputLabel,
  useMediaQuery,
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
  const isSmallScreen = useMediaQuery('(max-width:600px)');

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
    <Container>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>Corsa is a split calculator for trail racing.</h2>
      </div>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-start",
          height: "100%",
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: '16px',
        }}
      >
        <Box style={{ padding: "30px", width: "40vw", minWidth: "300px", backgroundColor: "grey", opacity: "90%" }} >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <h2 style={{ margin: "0" }}>Register</h2>

              <form onSubmit={onSubmitRegister}>
                <FormControl margin="normal">
                  <Input
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    id="my-email-input"
                    aria-describedby="my-helper-text"
                    placeholder="Email"
                  />
                </FormControl>
                <FormControl margin="normal">
                  <Input
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    id="my-password-input"
                    aria-describedby="my-helper-text"
                    placeholder="Password"
                  />
                </FormControl>
                <button type="submit">Register</button>
              </form>
            </Grid>
            <Grid item xs={8}>
              <div>
                <ol>
                  <li><h3>Get insights from GPX</h3></li>
                  <li><h3>Create pacing plan</h3></li>
                  <li><h3>Target performance goals</h3></li>
                </ol>
                <img style={{ width: '400px', height: '275px' }} src="https://i.postimg.cc/QtP6qHj4/Screenshot-2024-06-22-214158.png" alt="Application example" />
              </div>
            </Grid>
          </Grid>
        </Box>

        <Box style={{ padding: "30px", width: "20vw", minWidth: "300px", backgroundColor: "grey", opacity: "90%", display: "flex", justifyContent: "center" }} >
          <div style={{ width: "15vw", minWidth: "250px" }}>
            <h2 style={{ margin: "0" }}>Sign In</h2>

            <form onSubmit={onSubmitLogin} style={{ width: "100%" }}>
              <FormControl fullWidth margin="normal">
                <Input
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  id="my-email-input"
                  aria-describedby="my-helper-text"
                  placeholder="Email"
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Input
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  id="my-password-input"
                  aria-describedby="my-helper-text"
                  placeholder="Password"

                />
              </FormControl>
              <button type="submit">Sign in</button>
            </form>
          </div>



        </Box>
      </Box>
    </Container >
  );
};

export default Authenticate;
