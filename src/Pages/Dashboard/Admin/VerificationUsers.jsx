import { Avatar, Box, Button, CircularProgress, Grid, LinearProgress, Modal, Skeleton, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useReducer, useState } from "react";
import { Cookies } from "react-cookie";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { API } from '../../../Services/Api'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function userInfoReducer(state, action) {

    if (action.changeValue) switch (action.changeValue)
    {
        case 'all': return {
            username: action.username,
            name: action.name,
            avatar: action.avatar,
            phone: action.phone,
            credentials: {
                no_ktp: action.credentials.no_ktp,
                nik: action.credentials.nik,
                photo: action.credentials.photo
            }
        }
        case 'reset': return {
        avatar: null,
        username: null,
        name: null,
        phone: null,
        credentials: {
            no_ktp: null,
            nik: null,
            photo: null
        }
    }
    }
}
export default function VerificationUsers() {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const userDetailState = {
        avatar: null,
        username: null,
        name: null,
        phone: null,
        credentials: {
            no_ktp: null,
            nik: null,
            photo: null
        }
    }
    const [userInfo, setUserInfo] = useReducer(userInfoReducer, userDetailState)
    const [loadingTable, setLoadingTable] = useState(true)
    const [users, setUsers] = useState([])
    const [modalUser, setModalUser] = useState(false)
    const [userDetail, setUserDetail] = useState([])

    const setAvatar = (value) => {
        return `${process.env.REACT_APP_URL_IMAGE}profiles/${value}`
    }

    const closeModal = () => {
        setUserInfo({
                changeValue: 'reset'
            })
        return setModalUser(false)
    }

    const resetUserDetail = () => {
        setUserDetail({changeValue: 'reset', userDetailState: userDetailState})
    }
    const loadUsersDetail = async(username) => {
        setModalUser(true)
        await API.get('http://localhost:8000/api/leline/admin/dashboard/users/' + username)
        .then((res) => {
            if (res.status !== 200) return
            return setUserInfo({
                changeValue: 'all',
                avatar: setAvatar(res.data.user.photo),
                name: res.data.user.name,
                username: res.data.user.username,
                phone: res.data.user.phone,
                credentials: {
                    no_ktp: res.data.user.credential?.no_ktp,
                    nik: res.data.user.credential?.nik,
                    photo: res.data.user.credential?.photo,
                }
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
    const columnsVerificationUsers = [
        {
            field: 'number',
            headerName: 'Number',
            headerAlign: 'center',
            align: 'center',
            flex: 0
        },
        {
            field: 'username',
            headerName: 'Username',
            flex: 2,
            headerAlign: 'start'
        },
        {
            field: 'id',
            headerName: 'Action',
            renderCell: (cellValue) => (
                <Button variant={'outlined'} onClick={() => loadUsersDetail(cellValue.row.username)}>Details</Button>
            ),
            flex: 2,
            headerAlign: 'center',
            align: 'center'
        }
    ]

    const downloadCredential = async() => {
        await API.post('admin/dashboard/credentials', {
            username: userInfo.username,
        }, {
            responseType: 'blob'
        })
        .then((res) => {
            const blob = new Blob([res.data])
            // console.log(imageType)
            // console.log(URL.createObjectURL(blob))
            const download = document.createElement('a')
            download.href = URL.createObjectURL(blob)
            download.download = `credential-${userInfo.username}.jpg` 
            download.click()
        })
        .catch((err) => {
            console.log(err)
        })
    }
    const loadUser = async() => {
        await API.get('admin/dashboard/users')
        .then((res) => {
            if (res.status !== 200) return enqueueSnackbar('Error Something' + `[${res.status}]`, {
                variant: 'error'
            })

            setLoadingTable(false)
            return setUsers(res.data?.users?.data ?? [])
        })
        .catch((err) => {
            return enqueueSnackbar('Error Something' + `[${err.response.status}]`, {
                variant: 'error'
            })
        })

    }


    useEffect(() => {
        loadUser()
    }, [])
    return (
        <>
        <Typography component={'h1'} fontSize={'36px'}>Verification Users</Typography>
        <Grid>
            {loadingTable ?
            <Grid item xs={12}>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant={'overline'}>Please Wait</Typography><CircularProgress sx={{ marginLeft: '0.5rem' }} size={24} />
                </Box>
            </Grid>
            : 
            <Grid item xs={12}>
                <DataGrid sx={{ width: '100%' }}
                disableRowSelectionOnClick
                rows={users.map((data, i) => {
                    return {
                        id: data.id,
                        number: i+1,
                        username: data.username,
                    }
                }) ?? []}
                columns={columnsVerificationUsers}
                autoHeight
                />
            </Grid>
            }
        </Grid>
        <Modal
        open={modalUser}
        >
        <Box sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    backgroundColor: 'whitesmoke',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    width: '400px'
                 }}>
            <Typography variant={'caption'} sx={{ marginBottom: '0.5rem' }}>User Info</Typography>
            {/* <Skeleton variant="overlay"> */}
                 <Box display={'flex'} justifyContent={'center'} >
                    {!userInfo.avatar ?
                    <Skeleton variant={'circular'}>
                        <Avatar sx={{ bgcolor: 'grey', width: 72, height: 72 }}  children={userInfo.avatar === 'avatar.png' ? userInfo.username.toString().toUpperCase().split(' ')[0][0] : undefined} src={userInfo.avatar ? userInfo.avatar : null}/>
                    </Skeleton>
                    :
                        <Avatar sx={{ bgcolor: 'grey', width: 72, height: 72 }}  children={userInfo.avatar === 'avatar.png' ? userInfo.username.toString().toUpperCase().split(' ')[0][0] : undefined} src={userInfo.avatar ? userInfo.avatar : null}/>
                }
                    
                 </Box>
                    <Typography variant={'body2'} >Username</Typography>
                    {!userInfo.username ?
                    <Skeleton variant="overlay" width={'100%'}>
                        <Typography variant={'overline'}>loading...</Typography>
                    </Skeleton>
                    :
                    <Typography variant={'overline'}>{userInfo.username}</Typography>
                    }
                    <Typography variant={'body2'} >Name</Typography>
                    {!userInfo.name ?
                    <Skeleton variant="overlay" width={'100%'}>
                        <Typography variant={'overline'}>loading...</Typography>
                    </Skeleton>
                    :
                    <Typography variant={'overline'}>{userInfo.name}</Typography>
                    }
                    <Typography variant={'body2'} >Phone</Typography>
                    {!userInfo.phone ?
                    <Skeleton variant="overlay" width={'100%'}>
                        <Typography variant={'overline'}>loading...</Typography>
                    </Skeleton>
                    :
                    <Typography variant={'overline'}>{userInfo.phone}</Typography>
                    }
                 <Stack direction={'column'}>
                    <Typography variant={'caption'} sx={{ marginBottom: '0.5rem', backgroundColor: 'whitesmoke' }}><b>User Credentials</b></Typography>
                    <Typography variant={'body2'} >No. KTP</Typography>
                    {!userInfo.credentials.no_ktp ?
                    <Skeleton variant="overlay" width={'100%'}>
                        <Typography variant={'overline'}>loading...</Typography>
                    </Skeleton>
                    :
                    <Typography variant={'overline'}>{userInfo.credentials.no_ktp}</Typography>
                    }
                    <Typography variant={'body2'} >NIK</Typography>
                    {!userInfo.credentials.nik ?
                    <Skeleton variant="overlay" width={'100%'}>
                        <Typography variant={'overline'}>loading...</Typography>
                    </Skeleton>
                    :
                    <Typography variant={'overline'}>{userInfo.credentials.nik}</Typography>
                    }
                    {!userInfo.credentials?.photo ?
                    <Skeleton variant="overlay" width={'100%'} sx={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                        <Button variant={'contained'}>Download Credentials</Button>
                    </Skeleton>
                    :
                    <Button variant={'contained'} onClick={() => downloadCredential()} sx={{ marginBottom: '0.5rem' }}>Download Credentials</Button>
                    }
                    <Grid container columnSpacing={1} spacing={2}>
                        {userInfo.credentials?.photo ?
                        (<>
                        <Grid item xs={6}>
                            <Button variant="contained" color="success" fullWidth>Agree</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" color={'error'} fullWidth>Reject</Button>
                        </Grid>
                        </>)
                        :
                        (<>
                        <Grid item xs={6}>
                            <Skeleton variant="overlay" width={'100%'}>
                                <Button variant="contained" color="success" fullWidth>loading...</Button>
                            </Skeleton>
                        </Grid>
                        <Grid item xs={6}>
                            <Skeleton variant="overlay" width={'100%'}>
                                <Button variant="contained" color="success" fullWidth>loading...</Button>
                            </Skeleton>
                        </Grid>
                        </>)
                        }
                        
                        <Grid item xs={12}>
                            <Button variant="contained" color={'info'} fullWidth onClick={() => closeModal()}>Cancel</Button>
                        </Grid>
                    </Grid>

                 </Stack>
                
            {/* </Skeleton> */}
        </Box>
        </Modal>
        <SnackbarProvider
        anchorOrigin={{ 
            vertical: 'top',
            horizontal: 'center'
         }}
        />
        </>
    )
}