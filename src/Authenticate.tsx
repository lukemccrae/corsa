// import { useState } from "react";
// import UserPool from "./UserPool";
// import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
// import jwtdecode from "jwt-decode";
// import {
//   Box,
//   FormControl,
//   FormHelperText,
//   Grid,
//   Container,
//   Input,
//   InputLabel,
//   useMediaQuery,
// } from "@mui/material";
// import React from "react";
// import { retrieveUserToken } from "./helpers/token.helper";
// interface AuthenticationProps {
//   setUser: Function;
//   isLoggedIn: Boolean;
//   setIsLoggedIn: Function;
// }

// type CognitoToken = {
//   aud: string;
//   auth_time: number;
//   "cognito:username": string;
//   email: string;
//   email_verified: boolean;
//   event_id: string;
//   exp: number;
//   iat: number;
//   iss: string;
//   jti: string;
//   origin_jti: string;
//   sub: string;
//   token_use: string;
// };

// export const Authenticate = (props: AuthenticationProps) => {
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [needToRegister, setNeedToRegister] = useState(false);

//   const [registerEmail, setRegisterEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const isSmallScreen = useMediaQuery('(max-width:600px)');

//   React.useEffect(() => {
//     const token = retrieveUserToken()
//     if (token) {
//       // check for outdated token
//       const decodedToken = jwtdecode(token) as CognitoToken;
//       const { exp, email, sub } = decodedToken;

//       if (decodedToken.exp - Date.now() / 1000 > 0) {
//         setLoginState(email, exp, sub)
//       }

//     }
//   }, []);

//   const onSubmitRegister = (event: any) => {
//     event.preventDefault();

//     UserPool.signUp(registerEmail, registerPassword, [], [], (err, data) => {
//       if (err) {
//         console.error(err);
//       }
//       console.log(data);
//     });
//   };

//   const setLoginState = async (email: string, exp: number, userId: string) => {
//     props.setUser({ email, userId, exp });
//     props.setIsLoggedIn(true);
//   }

//   const onSubmitLogin = (event: any) => {
//     event.preventDefault();
//     const authenticationDetails = new AuthenticationDetails({
//       Username: loginEmail,
//       Password: loginPassword,
//     });
//     var userData = {
//       Username: loginEmail,
//       Pool: UserPool,
//     };
//     var cognitoUser = new CognitoUser(userData);

//     cognitoUser.authenticateUser(authenticationDetails, {
//       onSuccess: function (result) {
//         // const idTokenPayload = result.idToken.payload;

//         const idToken = result.getIdToken().getJwtToken();
//         const decodedToken = jwtdecode(idToken) as CognitoToken;

//         const { email, exp, sub } = decodedToken;

//         // set token in storage for auto login
//         localStorage.setItem('user', idToken);

//         setLoginState(email, exp, sub)
//       },

//       onFailure: function (err) {
//         alert(err);
//       },
//     });
//   };

//   return (
//     <Container>
//       <div style={{ display: "flex", justifyContent: "center" }}>
//         <h2>Corsa is a split calculator for trail racing.</h2>
//       </div>

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-around",
//           alignItems: "flex-start",
//           height: "100%",
//           flexDirection: isSmallScreen ? 'column' : 'row',
//           gap: '16px',
//         }}
//       >
//         <Box style={{ padding: "30px", width: "40vw", minWidth: "300px", backgroundColor: "grey", opacity: "90%" }} >
//           <Grid container spacing={2}>
//             <Grid item xs={4}>
//               <h2 style={{ margin: "0" }}>Register</h2>

//               <form onSubmit={onSubmitRegister}>
//                 <FormControl margin="normal">
//                   <Input
//                     value={registerEmail}
//                     onChange={(event) => setRegisterEmail(event.target.value)}
//                     id="my-email-input"
//                     aria-describedby="my-helper-text"
//                     placeholder="Email"
//                   />
//                 </FormControl>
//                 <FormControl margin="normal">
//                   <Input
//                     value={registerPassword}
//                     onChange={(event) => setRegisterPassword(event.target.value)}
//                     id="my-password-input"
//                     aria-describedby="my-helper-text"
//                     placeholder="Password"
//                     type="password"
//                   />
//                 </FormControl>
//                 <button type="submit">Register</button>
//               </form>
//             </Grid>
//             <Grid item xs={8}>
//               <div>
//                 <ol>
//                   <li><h3>Get insights from GPX</h3></li>
//                   <li><h3>Create pacing plan</h3></li>
//                   <li><h3>Target performance goals</h3></li>
//                 </ol>
//                 <img style={{ width: '400px', height: '275px' }} src="https://i.postimg.cc/QtP6qHj4/Screenshot-2024-06-22-214158.png" alt="Application example" />
//               </div>
//             </Grid>
//           </Grid>
//         </Box>

//         <Box style={{ padding: "30px", width: "20vw", minWidth: "300px", backgroundColor: "grey", opacity: "90%", display: "flex", justifyContent: "center" }} >
//           <div style={{ width: "15vw", minWidth: "250px" }}>
//             <h2 style={{ margin: "0" }}>Sign In</h2>

//             <form onSubmit={onSubmitLogin} style={{ width: "100%" }}>
//               <FormControl fullWidth margin="normal">
//                 <Input
//                   value={loginEmail}
//                   onChange={(event) => setLoginEmail(event.target.value)}
//                   id="my-email-input"
//                   aria-describedby="my-helper-text"
//                   placeholder="Email"
//                 />
//               </FormControl>
//               <FormControl fullWidth margin="normal">
//                 <Input
//                   value={loginPassword}
//                   onChange={(event) => setLoginPassword(event.target.value)}
//                   id="my-password-input"
//                   aria-describedby="my-helper-text"
//                   placeholder="Password"
//                   type="password"
//                 />
//               </FormControl>
//               <button type="submit">Sign in</button>
//             </form>
//           </div>



//         </Box>
//       </Box>
//     </Container >
//   );
// };

// export default Authenticate;


import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import jwtdecode from "jwt-decode";
import { retrieveUserToken } from "./helpers/token.helper";
import UserPool from "./UserPool";



// import ForgotPassword from './ForgotPassword';
import { FacebookIcon, StravaIcon } from './CustomIcons';
// import AppTheme from '../shared-theme/AppTheme';
// import ColorModeSelect from '../shared-theme/ColorModeSelect';


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

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

interface AuthenticationProps {
  setUser: Function;
  isLoggedIn: Boolean;
  setIsLoggedIn: Function;
  disableCustomTheme?: boolean
}

export const Authenticate = (props: AuthenticationProps) => {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const [needToRegister, setNeedToRegister] = React.useState(false);

  React.useEffect(() => {
    const token = retrieveUserToken()
    if (token) {
      // check for outdated token
      const decodedToken = jwtdecode(token) as CognitoToken;
      const { exp, email, sub } = decodedToken;

      if (decodedToken.exp - Date.now() / 1000 > 0) {
        setLoginState(email, exp, sub)
      }

    }
  }, []);

  const handleNeedToRegister = () => {
    setNeedToRegister(!needToRegister)
  }

  const onSubmitRegister = (event: any) => {
    const data = new FormData(event.currentTarget);

    const email = data.get('register-email')?.toString();
    const password = data.get('register-password')?.toString()

    if (!email || !password) {
      throw new Error('Your user credentials are invalid')
    }

    event.preventDefault();

    UserPool.signUp(email, password, [], [], (err, data) => {
      if (err) {
        console.error(err);
      }
      // on success set creds for login
      setNeedToRegister(false)
      const loginForm = new FormData(event.currentTarget);
      loginForm.set('email', email)
      loginForm.set('password', password)

    });
  };

  const setLoginState = async (email: string, exp: number, userId: string) => {
    props.setUser({ email, userId, exp });
    props.setIsLoggedIn(true);
  }

  const onSubmitLogin = (event: any) => {
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
        // const idTokenPayload = result.idToken.payload;

        const idToken = result.getIdToken().getJwtToken();
        const decodedToken = jwtdecode(idToken) as CognitoToken;

        const { email, exp, sub } = decodedToken;

        // set token in storage for auto login
        localStorage.setItem('user', idToken);

        setLoginState(email, exp, sub)
      },

      onFailure: function (err) {
        alert(err);
      },
    });
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}

        <Card variant="outlined">
          {/* <SitemarkIcon /> */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            {needToRegister ? "Sign up" : "Sign in"}
          </Typography>
          {!needToRegister ?
            <Box
              component="form"
              onSubmit={onSubmitLogin}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? 'error' : 'primary'}
                  sx={{ ariaLabel: 'email' }}
                />
              </FormControl>
              <FormControl>
                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpenForgotPassword}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                  Forgot your password?
                </Link>
              </Box> */}
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>

              {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Sign in
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <span>
                  <Typography
                    onClick={handleNeedToRegister}
                    variant="body2"
                    sx={{
                      alignSelf: 'center',
                      cursor: 'pointer',
                      display: 'inline',
                      color: 'primary.main',      // Link color
                      textDecoration: 'underline', // Underline style
                      "&:hover": { textDecoration: 'none' }, // Remove underline on hover
                    }}
                  >
                    Sign up
                  </Typography>
                  {/* <Divider>or</Divider>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => alert('Sign in with Strava')}
                      startIcon={<StravaIcon />}
                    >
                      Sign in with Strava
                    </Button>
                  </Box> */}
                </span>
              </Typography>
            </Box>
            : // TERNARY
            <Box
              component="form"
              onSubmit={onSubmitRegister}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="register-email"
                  type="email"
                  name="register-email"
                  placeholder="your@email.com"
                  autoComplete="register-email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? 'error' : 'primary'}
                  sx={{ ariaLabel: 'email' }}
                />
              </FormControl>
              <FormControl>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="register-password"
                  placeholder="••••••"
                  type="password"
                  id="register-password"
                  autoComplete="register-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Sign up
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Already registered?{' '}
                <span>
                  <Typography
                    onClick={handleNeedToRegister}
                    variant="body2"
                    sx={{
                      alignSelf: 'center',
                      cursor: 'pointer',
                      display: 'inline',
                      color: 'primary.main',      // Link color
                      textDecoration: 'underline', // Underline style
                      "&:hover": { textDecoration: 'none' }, // Remove underline on hover
                    }}
                  >
                    Sign in
                  </Typography>
                </span>
              </Typography>
            </Box>}
        </Card>
      </SignInContainer>

    </div>
  );
}