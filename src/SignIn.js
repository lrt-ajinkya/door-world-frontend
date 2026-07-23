import React, { useState, useRef, useEffect } from 'react';
import {
  useHistory,
  useLocation,
} from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Alert, AlertTitle } from '@material-ui/lab';

import authService from './services/authService'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const isMountedRef = useRef(true);
  
  let history = useHistory();
  let location = useLocation();

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  let { from } = location.state || { from: { pathname: "/new" } };

  // Cleanup function to track component mount status
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const signIn = async () => {
    setIsLoading(true)
    try {
      await authService.login(email, password)
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        history.replace(from)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setError(error.message)
        setIsLoading(false)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading && email && password) {
      e.preventDefault()
      signIn()
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Door World
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="User"
                name="email"
                autoComplete="email"
                onChange={(e) => {setEmail(e.target.value); setError(null)}}
                onKeyDown={handleKeyDown}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => {setPassword(e.target.value); setError(null)}}
                onKeyDown={handleKeyDown}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signIn}
          >
            {isLoading ? <CircularProgress color="secondary" size={24} className={classes.buttonProgress} /> : 'LOGIN'}
          </Button>
          {error && <Grid item xs={12}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Grid>}
        </form>
      </div>
    </Container>
  );
}