import Typography from '@mui/material/Typography';
import LinkMui from '@mui/material/Link'
import { Box, AppBar, Toolbar, InputBase, styled, Button, Stack, IconButton, Badge, Popover, Avatar, Popper, MenuList, ListItemIcon, ListItemText, MenuItem, Divider, Snackbar, Alert } from '@mui/material';
import { Notifications, Search, FilterList, Close, ArrowCircleLeft, ArrowBackIos, Person, PowerSettingsNew } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from 'axios';
export default function Navbar() {
  const [openNotif, setOpenNotif] = useState(false);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [anchorMyProfile, setAnchorMyProfile] = useState(null)
  const [openMyProfile, setOpenMyProfile] = useState(false)
  const [ApiImage, setApiImage] = useState(null)
  const [search, setSearch] = useState('');
  const [user, setUser] = new useState({});
  const userData = JSON.parse(localStorage.getItem('__user'))
  const [msgResponse, setMsgResponse] = useState({
    type: 'error',
    show: false,
    message: null
  })
  const navigate = new useNavigate();
  const cookies = new Cookies();

  // API
  const API = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
  });

  const handleclose = (event) => {
    setOpenNotif(false);
  };

  const handleMouseNotif = (target) => {
    setAnchorNotif(target)
    setOpenNotif(true);
  };

  const handleMouseProfile = (target) => {
    setAnchorMyProfile(target)
    setOpenMyProfile(true)
  }

  const handleLogout = async() => {
    await API.postForm('logout', {}, {
      headers: {
        Authorization: 'Bearer ' + cookies.get('__token_'),
        Accept: 'application/json',
      }
    }).then((res) => {
      if (res.status !== 200) return

      setMsgResponse({
        type: 'success',
        show: true,
        message: 'Logout Successfully'
      })

    }).catch((err) => {
      setMsgResponse({
        type: 'error',
        show: true,
        message: 'Logout Failed, please check credentials [' + err.response.status + ']'
      })
      setTimeout(() => {
        setMsgResponse({show: false})
      }, 3000)
    })
      localStorage.removeItem('__user');
      cookies.remove('__token_');
    

      return window.location.reload()
  }

  const toLogin = () => {
    return navigate('leline/login');
  };
  const tes = async () => {
    await API.get('tes', {})
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  const toProfile = (username) => {
    return navigate(`dashboard/profiles/${username}`)
  }

  useEffect(() => {
    if (!cookies.get('__token_')) {localStorage.clear()}
    setUser( localStorage.getItem('__user') ? JSON.parse(localStorage.getItem('__user')) : {});
    console.log(user)
  }, []);
  // Styled MUI

  const SearchBar = (theme) => ({
    backgroundColor: 'white',
    padding: '0 10px',
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  });

  const SearchBarMobile = (theme) => ({
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['border', 'box-shadow'], { duration: theme.transitions.duration.standard }),
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      border: '1px solid blue',
    },
    'StyledInputBase.Mui-focused': {
      border: '1px solid black',
      boxShadow: '4px 3px 4px 0 #3d5afe',
    },
  });

  const StyledInputBase = (theme) => ({
    width: '200px',
    transition: theme.transitions.create(['width'], { duration: theme.transitions.duration.standard }),
    [theme.breakpoints.up('sm')]: {
      ':hover': {
        width: '300px',
      },

      '&.Mui-focused': {
        width: '300px',
      },
    },

    [theme.breakpoints.down('sm')]: {
      width: '250px',
      ':hover': {
        width: '270px',
      },
      '&.Mui-focused': {
        width: '270px',
      },
    },
  });

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 6,
      top: 6,
    },
  }));

  return (
    <>
      <Box>
        <Snackbar open={msgResponse.show} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} autoHideDuration={3000}>
          <Alert severity={msgResponse.type}>{msgResponse.message}</Alert>
        </Snackbar>
        <AppBar position="sticky" sx={{ zIndex: '1' }} color="primary">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6">
              <LinkMui underline="none" href="/" color={'inherit'}>
                LeLine
              </LinkMui>
            </Typography>
            <Box sx={SearchBar}>
              <InputBase sx={StyledInputBase} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Auction Items..." startAdornment={<Search />} />
            </Box>
            <Stack direction="row">
              {/* Notification Design  */}
              <Box sx={{ position: 'sticky', alignItems: 'center', margin: 'auto' }} display={user.username ? 'block' : 'none'}>
                <IconButton
                  id="notif-menu-button"
                  // aria-haspopup={'true'}
                  onMouseEnter={(e) => handleMouseNotif(e.currentTarget)}
                  onMouseLeave={() => setOpenNotif(false)}
                >
                  <StyledBadge variant="dot" color="error" invisible={true}>
                    {/*Pake NotifLeline*/}
                    <Notifications sx={{ color: 'white' }} />
                  </StyledBadge>
                </IconButton>
                <Popper
                  sx={{ zIndex: '2', maxWidth: '300px', boxShadow: '0 0 8px 0 rgb(0,0,0,0.2)', borderRadius: '0.5rem', bgcolor: 'white', padding: '1rem' }}
                  placement="bottom-end"
                  anchorEl={anchorNotif}
                  open={openNotif}
                  onMouseEnter={(e) => setOpenNotif(true)}
                  onMouseLeave={() => setOpenNotif(false)}
                >
                  <Typography variant="subtitle" color="initial">
                    You're haven't any notification Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum a necessitatibus repellat ipsum corrupti nulla repellendus obcaecati, qui architecto in dolorem. Officia, hic beatae vero, commodi ab culpa ut in libero pariatur, amet harum! Ea maxime, facere laborum repellendus illo praesentium nulla, delectus sit repudiandae, aliquid at nisi numquam aliquam.
                  </Typography>
                </Popper>
              </Box>
              {/* End Notification Design  */}
              {!user?.username ? (
                <Button variant="h6" onClick={() => toLogin()}>
                  Login
                </Button>
              ) : undefined}
              {user?.username ? (
                <>
                  <Button aria-describedby="pop-profile" onMouseEnter={(e) => handleMouseProfile(e.currentTarget)} onMouseLeave={(e) => setOpenMyProfile(false)}>
                    <Avatar sx={{ bgcolor: 'grey' }} children={user?.avatar === 'avatar.png' ? user?.username.toString().toUpperCase().split(' ')[0][0] : undefined} src={user?.avatar !== undefined ? `${process.env.REACT_APP_URL_IMAGE}profiles/${user?.avatar}` : undefined} />
                  </Button>
                  <Popper
                    onMouseEnter={(e) => setOpenMyProfile(true)}
                    onMouseLeave={(e) => setOpenMyProfile(false)}
                    id="pop-profile"
                    sx={{ zIndex: '2', boxShadow: '0 0 8px 0 rgb(0,0,0,0.2)', borderRadius: '0.5rem' }}
                    placement="bottom-end"
                    anchorEl={anchorMyProfile}
                    open={openMyProfile}
                  >
                    <Box position={'sticky'} sx={{ backgroundColor: 'white', borderRadius: '0.5rem' }}>
                      <MenuList>
                        <MenuItem>
                          <ListItemIcon>
                            <Person fontSize="small" />
                          </ListItemIcon>
                          <ListItemText onClick={() => toProfile(userData.username)} >My Profile</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={(e) => handleLogout()}>
                          <ListItemIcon>
                            <PowerSettingsNew fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Logout</ListItemText>
                        </MenuItem>
                      </MenuList>
                    </Box>
                  </Popper>
                </>
              ) : undefined}
            </Stack>
          </Toolbar>
        </AppBar>
        <Box display={'flex'} justifyContent={'center'} marginTop={'1rem'}>
          <Box sx={SearchBarMobile}>
            <InputBase sx={StyledInputBase} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Auction Items..." startAdornment={<Search />} />
          </Box>
        </Box>
      </Box>
      <Outlet />
    </>
  );
}
