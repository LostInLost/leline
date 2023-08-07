import styled from '@emotion/styled';
import { Box, Grid, Card, CardMedia, FormControlLabel, Checkbox, CardContent, Typography, Stack, TextField, FormControl, Button, Divider, useScrollTrigger, Alert } from '@mui/material';
import {API} from '../Services/Api'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [messageAlert, setMsgAlert] = useState({
    isSuccess: false,
    msg: null
  });
  const defaultNoError = {
    error: false,
    message: null
  }
  const [errorMail, setErrMail] = useState([])
  const [isErrorEmail, setErrorEmail] = useState(defaultNoError);
  const [isErrorName, setErrorName] = useState(defaultNoError);
  const [isErrorUsername, setErrorUsername] = useState(defaultNoError);
  const [isErrorPassword, setErrorPassword] = useState(defaultNoError);
  const [isErrorRePassword, setErrorRePassword] = useState(defaultNoError);
  const [role, setRole] = useState(false);
  const URL = process.env.REACT_APP_URL_MOBILE;
  const navigate = new useNavigate()

  // Controlling Handle
  const handleSubmitRegister = async(event) => {
    setMsgAlert({isSuccess: false})
    event.preventDefault();
    const formData = {
      name: name,
      username: username,
      email: email,
      password: password,
      re_password: rePassword,
      role: role ? 1 : 0
    };
      await axios.get(process.env.REACT_APP_URL_COOKIE, {
      withCredentials: true
    })
      // await axios.get(process.env.REACT_APP_URL_API + 'csrf-leline')
      // .then((res) => csrf = res.data.token)
      await API.postForm('register', formData)
        .then((res) => {
          if (res.status !== 200) return;

          // setErrorEmail(defaultNoError)
          setErrorName(defaultNoError)
          setErrorPassword(defaultNoError)
          setErrorRePassword(defaultNoError)
          setErrorUsername(defaultNoError)

          setMsgAlert({
            isSuccess: true,
            msg: 'Data successfullly created, we will redirecting to Login Page'
          })

          return setTimeout(() => {
            navigate('/leline/login')
          }, 1000)
        })
        .catch((err) => {
          
          if (err.response.status === 400)
          {
            const errors = err.response.data.errors
            setErrMail(errors.email ?? [])
            setErrorPassword({
              error: !errors.password ? false : true,
              message: !errors.password ? '' : errors.password[0]
            })
            setErrorEmail({
              error: !errors.email ? false : true,
              message: !errors.email ? '' : errors.email[0],
            });
            setErrorName({
              error: !errors.name ? false : true,
              message: !errors.name ? '' : errors.name[0],
            });
            setErrorRePassword({
              error: !errors.re_password ? false : true,
              message: !errors.re_password ? '' : errors.re_password[0],
            });
            setErrorUsername({
              error: !errors.username ? false : true,
              message: !errors.username ? '' : errors.username[0],
            });
          }
        });
  };

  const handleRePassword = (value) => {
    setRePassword(value);
  };

  // Styling MUI
  const CardLogin = (theme) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '1000px',
    height: 'auto',
    display: 'flex',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      width: '400px',
      height: 'auto',
    },
  });

  const BgLogin = styled(Box)(({ theme }) => ({
    background: 'rgb(2,0,36)',
    background: 'linear-gradient(9deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(0,212,255,1) 100%)',
    display: 'flex',
    height: '100vh',
    [theme.breakpoints.down('sm')]: {
      height: '100vh',
    },
  }));
  const BtnLogin = styled(Button)(({ theme }) => ({
    backgroundColor: '#094679',
    color: 'white',
    ':hover': {
      backgroundColor: '#1e629c',
    },
  }));

  useEffect(() => {

  }, []);
  return (
    <>
      <BgLogin></BgLogin>
      <Card sx={CardLogin}>
        <CardMedia component={'img'} sx={{ width: { sm: '300px' }, objectFit: 'cover' }} alt="Login Page" image={URL + 'RegisterPage.jpg'} />
        <Box>
          <CardContent>
            <Stack display={'flex'} justifyContent={'center'} alignItems={'stretch'} width={'100%'}>
              <Typography variant="h5" color="initial" sx={{ marginBottom: '1rem' }}>
                Register Page
              </Typography>
              <Alert severity='success' sx={{ display: messageAlert.isSuccess ? 'block' : 'none' }}>
                {messageAlert.msg}
              </Alert>
              <form action="" onSubmit={handleSubmitRegister}>
                <FormControl>
                  <Grid container columnSpacing={2}>
                    <Grid item xs="12" sm="6">
                      <TextField
                        type="text"
                        error={isErrorName.error}
                        helperText={isErrorName.message}
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        sx={{ display: 'flex', alignItems: 'stretch' }}
                        label="Name"
                        margin="normal"
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs="12" sm="6">
                      <TextField
                        type="text"
                        error={isErrorUsername.error}
                        helperText={isErrorUsername.message}
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ display: 'flex', alignItems: 'stretch' }}
                        label="Username"
                        margin="normal"
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs="12" sm="6">
                      <TextField
                        type="email"
                        error={errorMail.length !== 0}
                        helperText={errorMail[0] ?? null}
                        required
                        value={email}
                        onChange={(e) => {setEmail(e.target.value);}}
                        sx={{ display: 'flex', alignItems: 'stretch' }}
                        label="Email"
                        margin="normal"
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs="12" sm="3">
                      <TextField
                        type="password"
                        error={isErrorPassword.error}
                        helperText={isErrorPassword.message}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ display: 'flex', alignItems: 'stretch' }}
                        label="Password"
                        margin="normal"
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs="12" sm="3">
                      <TextField
                        type="password"
                        error={isErrorRePassword.error}
                        helperText={isErrorRePassword.error ? isErrorRePassword.message : undefined}
                        required
                        value={rePassword}
                        onChange={(e) => handleRePassword(e.target.value)}
                        sx={{ display: 'flex', alignItems: 'stretch' }}
                        label="Re-Password"
                        margin="normal"
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs="12" sm="6">
                      <FormControlLabel control={<Checkbox checked={role} onClick={() => setRole(!role)} />} label="I want to be Auctioneer" />
                    </Grid>
                  </Grid>

                  <BtnLogin type="submit">Register</BtnLogin>
                </FormControl>
              </form>
            </Stack>
            <Divider sx={{ marginTop: '0.5rem' }} orientation="horizontal">
              <Typography variant="body2">Or</Typography>
            </Divider>
            <Box display={'flex'} justifyContent={'center'}>
              <Typography sx={{ marginTop: '1rem' }} variant="caption" color="initial">
                Already have account? <Link to={'/leline/login'}>Login</Link>
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};

export default RegisterPage;
