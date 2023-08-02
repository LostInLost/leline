import { Box, Button, CircularProgress, Grid, LinearProgress, Modal, Skeleton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { API } from '../../../Services/Api'
import { useNavigate } from "react-router-dom";
export default function VerificationUsers() {
    const cookies = new Cookies();
    const navigate = useNavigate()

    const [loadingTable, setLoadingTable] = useState(true)
    const [loadingUser, setLoadingUser] = useState(false)
    const [users, setUsers] = useState([])
    const [modalUser, setModalUser] = useState(true)
    const [userDetail, setUserDetail] = useState([])
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
                <Button variant={'outlined'}>Details</Button>
            ),
            flex: 2,
            headerAlign: 'center',
            align: 'center'
        }
    ]

    const loadUser = async() => {
        await API.get('admin/dashboard/users')
        .then((res) => {
            if (res.status !== 200) return enqueueSnackbar('Error Something' + `[${res.status}]`, {
                variant: 'error'
            })

            setLoadingTable(false)
            return setUsers(res.data?.users ?? [])
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
                rows={users?.map((data, i) => {
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
                 <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <Typography variant={'body2'} >Username</Typography>
                    {loadingUser ?
                    <Skeleton variant="overlay" width={'100%'} />
                    :
                    <Typography variant={'subtitle'}>tes</Typography>
                    }
                 </div>
                 <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <Typography variant={'body2'} >Name</Typography>
                    <Skeleton variant="overlay" width={'100%'} />
                    <Typography variant={'subtitle'}>tes</Typography>
                 </div>
                 <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <Typography variant={'body2'} >Username</Typography>
                    <Skeleton variant="overlay" width={'100%'} />
                    <Typography variant={'subtitle'}>tes</Typography>
                 </div>
                <Typography variant={'caption'} sx={{ marginBottom: '0.5rem' }}>User Credentials</Typography>
                
                 <Button variant={'contained'}>Download Credentials</Button>
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