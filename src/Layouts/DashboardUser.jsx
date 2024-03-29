import { Link, Outlet, useLoaderData, useNavigate, useParams, useRouteLoaderData } from "react-router-dom"
import Typography from '@mui/material/Typography'
import { Box, Button, Container, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Popper } from "@mui/material"
import SideBar from './SideBar'
import styled from "@emotion/styled"
import { useState } from "react"
import Profile from "../Pages/Dashboard/Profile"
import { AccountBox, DensityMedium, Home, PowerSettingsNew, VerifiedUser } from "@mui/icons-material"
import { API, cookies } from '../Services/Api'


export default function DashboardUser() {

    const data = useLoaderData()
    const params = useParams()
    const navigate = useNavigate()
    const [anchorDashboard, setAnchorDashboard] = useState(null);
    const [openDashboard, setOpenDashboard] = useState(false);
    const userData = JSON.parse(localStorage.getItem('__user'))
    const handleDashboard = (target) => {
        setOpenDashboard(!openDashboard)
        setAnchorDashboard(target)
    }

    const handleLogout = async() => {
    await API.post('logout').then((res) => {
      if (res.status !== 200) return
        localStorage.removeItem('__user');
        cookies.remove('__token_');
        return window.location.reload()
      })
        .catch((err) => {

    })
      

      
  }

    return (
        <>
        <Box sx={{ position: 'absolute', backgroundColor: '#2072BA', width: '100vw', height: '100vh' }}>
        <Container sx={{ backgroundColor: 'white', padding: '1.5rem' }}>
            <Grid container columnSpacing={2} xs={'12'}>
                <Grid item xs='12'>
                    <Button  onMouseEnter={(e) => handleDashboard(e.currentTarget)}
                    onMouseLeave={() => setOpenDashboard(false)}
                    >
                        <DensityMedium />
                    </Button>
                    <Popper sx=
                    {{ 
                    backgroundColor: 'whitesmoke', 
                    // padding: '0.5rem', 
                    boxShadow: '0 0 8px 0 rgb(0,0,0,0.4)',
                    borderRadius: '0.5rem'
                    }} 
                    open={openDashboard} anchorEl={anchorDashboard} placement="bottom-start" onMouseEnter={() => setOpenDashboard(true)} onMouseLeave={() => setOpenDashboard(!openDashboard)}>
                        <Box>
                            <List 
                            // subheader={<Typography component={'span'}>Menu</Typography>}
                            >
                                <MenuItem onClick={() => navigate(`/dashboard/profiles/${userData?.username}`)}>
                                    <ListItemIcon>
                                        <AccountBox />
                                    </ListItemIcon>
                                    <ListItemText primary={'Profile'} />
                                </MenuItem>
                                <MenuItem onClick={() => navigate('/')}>
                                    <ListItemIcon>
                                        <Home />
                                    </ListItemIcon>
                                    <ListItemText primary={'Home'} />
                                </MenuItem>
                                {data.user?.role === 2 ?
                                <>
                                <Divider />
                                <MenuItem onClick={() => navigate('/dashboard/admin/verification_users')}>
                                    <ListItemIcon>
                                        <VerifiedUser />
                                    </ListItemIcon>
                                    <ListItemText primary={'Verification Users'} />
                                </MenuItem>
                                </>
                                : undefined
                              }
                                
                                <Divider />
                        <MenuItem onClick={() => handleLogout()}>
                          <ListItemIcon>
                            <PowerSettingsNew fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Logout</ListItemText>
                        </MenuItem>
                            </List>
                        </Box>
                    </Popper>
                </Grid>
                <Grid item xs={'12'} sx={{ marginTop: '1rem' }}>
                    <Outlet />
                </Grid>
            </Grid>
        </Container>
        </Box>
        </>
    )
}