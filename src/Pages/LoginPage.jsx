import styled from '@emotion/styled';
import { Box, Container, Card, CardMedia, CardContent, Typography, Stack, TextField, FormControl, Button, Divider, Alert, AlertTitle, FormLabel, FormHelperText, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { Cookies, useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = new useState('');
  const [password, setPassword] = new useState('');
  const [ref, setRef] = new useState(null);
  const cookies = new Cookies();
  const [isLoad, setLoad] = useState(false);
  const navigate = new useNavigate()
  const [success, setSuccess] = new useState({
    display: 'none',
    color: 'error',
    title: null,
    message: null,
  });
  // Handle Login
  const API = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
  });
  const URL = process.env.REACT_APP_URL_MOBILE;

  const handleSubmit = async(event) => {
    event.preventDefault();
    setLoad(true);
    axios.get(process.env.REACT_APP_URL_COOKIE).then(async () => {
      setSuccess({
        display: 'none  '
      })
      await API.postForm(
        'auth',
        {
          email: email,
          password: password,
        },
        {}
      )
        .then((res) => {
          if (res.status != 200) return;
          if (!res.data.success) return;
          const dataUser = {
            username: res.data.data.username,
            avatar: res.data.data.photo,
            tag: res.data.data.tag,
          }
          console.log(dataUser)
          localStorage.setItem('__user', JSON.stringify(dataUser))
          cookies.set('__token_', res.data.token, {
            secure: true,
          })

          setSuccess({
            display: 'flex',
            color: 'success',
            title: 'Success',
            message: 'Login Successfully, we will redirecting you to homepage'
          })

          setLoad(false);

          return setTimeout(() => {
            return navigate('/')
          }, 1000)
        })
        .catch((err) => {
          setLoad(false)
          console.log(err);
          return setSuccess({
            display: 'flex',
            color: 'error',
            title: 'Login Failed',
            message: 'Username or Password not match',
          });
        });
    });
  };

  useEffect(() => {
    // cookies.remove('__token')
    // cookies.remove('__user')
  }, [])
  // Styling MUI
  
  const CardLogin = (theme) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '700px',
    height: 'auto',
    display: 'flex',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
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
  useEffect(() => {}, []);
  return (
    <>
      <BgLogin></BgLogin>
      <Card sx={CardLogin} key={'card123'} id="card-d">
        <CardMedia component={'img'} sx={{ width: { sm: '300px' }, objectFit: 'cover' }} alt="Login Page" image={URL + 'LoginImage.png'} />
        <Box>
          <CardContent>
            <Stack display={'flex'} justifyContent={'center'} alignItems={'stretch'} width={'100%'}>
              <Typography variant="h5" color="initial" sx={{ marginBottom: '1rem' }}>
                Login Page
              </Typography>
              <Alert severity={success.color} sx={{ display: success.display }}>
                <AlertTitle>{success.title}</AlertTitle>
                {success.message}
              </Alert>
              <form onSubmit={(e) => handleSubmit(e)} key={'form'}>
                <FormControl>
                  <TextField
                    disabled={isLoad ? true : false}
                    autoFocus
                    type="email"
                    name="email"
                    id="email12"
                    key={'email12'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ display: 'flex', width: '360px' }}
                    label="Email"
                    margin="normal"
                    variant="filled"
                  />
                  <TextField
                    disabled={isLoad ? true : false}
                    id="password"
                    key={'password'}
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    sx={{ display: 'flex', width: '360px' }}
                    label="Password"
                    margin="normal"
                    variant="filled"
                  />
                  <LinearProgress sx={{ display: isLoad ? 'block' : 'none' }} />
                  <BtnLogin sx={{ marginTop: '1rem' }} type="submit">
                    Login
                  </BtnLogin>
                </FormControl>
              </form>
            </Stack>
            <Divider sx={{ marginTop: '0.5rem' }} orientation="horizontal">
              <Typography variant="body2">Or</Typography>
            </Divider>
            <Box display={'flex'} justifyContent={'center'}>
              <Typography sx={{ marginTop: '1rem' }} variant="caption" color="initial">
                Not already have account? <Link to={'/leline/register'}>Register here</Link>
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  );
};

export default LoginPage;
