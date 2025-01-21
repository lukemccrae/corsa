import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import jwtdecode from "jwt-decode";
import { retrieveUserToken } from "./helpers/token.helper";
import UserPool from "./UserPool";
import { StravaIcon } from './CustomIcons';

import AWS from 'aws-sdk';

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

interface AuthenticationProps {
  isLoggedIn: boolean;
  login: Function;
  logout: Function;
}

export const Authenticate = (props: AuthenticationProps) => {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const [needToRegister, setNeedToRegister] = React.useState(false);

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
    props.login({ email, userId, exp })
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
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
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