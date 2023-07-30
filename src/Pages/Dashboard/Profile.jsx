import { Avatar, Box, Button, Grid, Input, LinearProgress, Modal, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { Cookies } from "react-cookie";
import { SnackbarProvider, enqueueSnackbar,  } from "notistack";
import axios from "axios";

export default function Profile(){
    let data = useLoaderData()
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [user, setUser] = useState({})
    const [avatar, setAvatar] = useState(null)
    const inputAvatar = useRef(null)
    const [email, setEmail] = useState('')
    const [isInputCredentials, setIsInputCredentials] = useState(false)
    const [Submitting, setSubmitting] = useState(false)
    const [nik, setNik] = useState('')
    const [ktp, setKtp] = useState('')
    
    const photoKTPRef = useRef()
    const [password, setPassword] = useState('')
    const [credentialOpen, setCredentialOpen] = useState(false)

    // Error Callback Variable 
    const [errNik, setErrNik] = useState([])
    const [errKtp, setErrKtp] = useState([])
    const [errPhotoKtp, setErrPhotoKtp] = useState([]) 
    
    // End Error CallBack Variable 
    const cookies = new Cookies();
     const API = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
    });

    const getUserInfo = async() => {
        await API.get('user', {
            headers: {
                Authorization: `Bearer ${cookies.get('__token_')}`
            }
        })
        .then((res) => {
            return data = res.data
        })
        .catch((err) => {
            if (err.response?.status === 502) return enqueueSnackbar('Bad Gateaway[502]', {
                variant: 'error'
            })
        })
    }

    const setProfile = () => {
        setUsername(data.user?.username)
        setName(data.user?.name)
        setEmail(data.user?.email)
        setPhone(data.user?.phone)
    }


    const clearValidation = () => {
        setErrKtp([])
        setErrNik([])
        setErrPhotoKtp([])
    }
    const handleAvatar = (target) => {
        setAvatar(target)
    }

    const openCredential = () => {
        setCredentialOpen(true)
    }

    const submitCredentials = async() => {
        setSubmitting(true)
        clearValidation()
        const formData = new FormData()
        await formData.append('photo', photoKTPRef.current.files[0])
        await formData.append('nik', nik)
        await formData.append('no_ktp', ktp)

        await API.postForm('user/verification', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${cookies.get('__token_')}`,
                Accept: 'application/json'
            }
        })
        .then((res) => {
            setSubmitting(false)
            if (res?.status !== 200) return enqueueSnackbar(`Upload Credentials Not Successfully[${res.status}]`, {
                variant: 'error'
            })
            
            enqueueSnackbar('Upload Credentials Successfully.', {
                variant: 'success'
            })

            return window.location.reload(  )
        })
        .catch((err) => {
            if (err.response.status === 409) return enqueueSnackbar(err.response.data?.message, {
                variant: 'error'
            })

            if (err.response.status === 400) {
                setErrPhotoKtp(err.response.data.errors.photo ?? [])
                setErrNik(err.response.data.errors.nik ?? [])
                setErrKtp(err.response.data.errors.no_ktp ?? [])
                console.log(err.response.data.errors)
                setSubmitting(false)
                return
            }
        })
    }

    const checkInputCredentials = () => {
        if (!photoKTPRef.current?.files[0]) return setIsInputCredentials(false)

        return setIsInputCredentials(true)
    }

    const checkValidSubmitCredentials = () => {
        return !isInputCredentials || nik == null || nik == '' || ktp == null || ktp == ''
    }

    // const checkSaveChanges = () => {
    //     if (name !== data.user?.name || phone !== data.user?.phone || email !== data !== data.user?.email || username !== data.user?.username)
    // }

    const TextCredentialButton = () => {
        if (data.user?.state === 0) return 'Verify Credential'
        if (data.user?.state === 1) return 'Verifying...'
        if (data.user?.state === 2) return 'Verified'
    }
    useEffect(() => {
        setProfile()
        setUser( localStorage.getItem('__user') ? JSON.parse(localStorage.getItem('__user')) : {});
    }, [])
    return (
        <>
        <Typography component={'h1'} fontSize={'36px'}>Profile</Typography>
        <Grid container columnSpacing={2}>
            <Grid item xs={12} justifyContent={'center'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <input ref={inputAvatar} type="file" style={{ display: 'none' }} onChange={(e) => handleAvatar(e.target.files[0])} />
                {/* <Avatar sx={{ bgcolor: 'grey', width: 72, height: 72 }}  children={user?.avatar === 'avatar.png' ? user?.username.toString().toUpperCase().split(' ')[0][0] : undefined} src={user?.avatar !== 'avatar.png' ? user?.avatar : undefined} /> */}
                <Avatar sx={{ bgcolor: 'grey', width: 72, height: 72 }}  children={user?.avatar === 'avatar.png' ? user?.username.toString().toUpperCase().split(' ')[0][0] : undefined} src={avatar ? URL.createObjectURL(avatar) : user?.photo} />
                
                <br />
                <Typography component={'h2'} sx={{ ':hover': {cursor: 'pointer'} }} onClick={() => inputAvatar.current.click()}>Edit Photo Profile <EditIcon sx={{ fontSize: '12px' }} /></Typography>
            </Grid> 
            <Grid item xs={12} sx={{ marginTop: '1rem' }} >
                <Stack direction={'column'}  sx={{ justifyContent: 'center', display: 'flex', }} flexWrap={'wrap'} >
                    <TextField type="text" variant="outlined" sx={{ margin: '1rem' }} value={username} label={'Username'} onChange={(e) => setUsername(e.target.value)} />
                    <TextField type="text" variant="outlined" sx={{ margin: '1rem' }} value={name} label={'Name'} onChange={(e) => setName(e.target.value)} />
                    <TextField type={'number'} variant="outlined" focused color={!phone || phone === '' ? 'warning' : undefined} sx={{ margin: '1rem' }} value={phone} label={'Phone'} placeholder="Input Phone Number" onChange={(e) => setPhone(e.target.value)} />
                    <TextField type="email" variant="outlined" sx={{ margin: '1rem' }} value={email} label={'Email'} onChange={(e) => setEmail(e.target.value)} />
                    <TextField helperText={'Please fill if you want change'} type="password" variant="outlined" sx={{ margin: '1rem' }} value={password} label={'Password'} onChange={(e) => setPassword(e.target.value)} />
                </Stack>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '1rem' }}>
                <Typography variant="subtitle1" color="initial" >Status Credential</Typography>
                <Button disabled={data.user?.state !== 0} sx={{ margin: '1rem' }} onClick={() => openCredential()}  variant="outlined">{TextCredentialButton()}</Button>
                <Modal  open={credentialOpen} onClose={() => setCredentialOpen(false)}>
                <Box sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    backgroundColor: 'whitesmoke',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                 }}>
                    <form action="" onSubmit={(e) => {
                        e.preventDefault()
                        submitCredentials()
                    }}>
                    <Stack direction={'row'}>
                    <Typography sx={{ 
                        color: 'dark'
                     }} variant="subtitle1" id={'credential-title'} color="initial">Verify Your Credential</Typography>
                     </Stack>
                     <Stack direction={'column'} columnGap={2} spacing={2}>
                     <TextField type="file" inputRef={photoKTPRef} onChange={() => checkInputCredentials()} sx={{ display: 'none' }} />
                        <Typography display={errPhotoKtp.length !== 0 ? 'block' : 'none'} variant={'span'} color={'red'}>{errPhotoKtp[0] ?? null}</Typography>
                        {isInputCredentials ? 
                        <Button disabled={Submitting} variant="filled" sx={{ backgroundColor: 'red', color: 'white' , margin: '0.5rem', }} onClick={() => {
                            setErrPhotoKtp([])
                            photoKTPRef.current.value = null
                            checkInputCredentials()
                        }}>Delete KTP</Button>
                        : 
                        <Button disabled={Submitting} variant="filled" sx={{ backgroundColor: '#4287f5', margin: '0.5rem', display: isInputCredentials ? 'none' : 'block' }} onClick={() => photoKTPRef.current.click()}>Upload KTP</Button>
                        }
                        <TextField disabled={Submitting} required error={errNik.length !== 0} helperText={errNik[0] ?? null} type="text" placeholder="Input your NIK" variant="standard" onChange={(e) => setNik(e.target.value)} />
                        <TextField disabled={Submitting} required error={errKtp.length !== 0} helperText={errKtp[0] ?? null} type="text" placeholder="Input your KTP Number" variant="standard" onChange={(e) => setKtp(e.target.value)} />
                     {Submitting ?
                     <LinearProgress />
                        : undefined
                    }
                     </Stack>
                        
                    <Box sx={{ 
                        display: 'flex',
                        marginTop: '1rem'
                     }}>
                        <Button variant="filled" disabled={checkValidSubmitCredentials()} sx={{ backgroundColor: '#42f557', margin: '0.5rem' }} type="submit">Submit</Button>
                    
                        <Button onClick={() => setCredentialOpen(false)} variant="filled" sx={{ backgroundColor: '#42f557', margin: '0.5rem' }}>Cancel</Button>
                    </Box>
                    </form>
                </Box>
                </Modal>
            </Grid>

            <Grid item xs={12} sx={{ marginTop: '1rem', display: 'flex' }} >
                     <Button variant={'contained'} sx={{ marginLeft: 'auto' }}>Submit</Button>
            </Grid>
        </Grid>
        <SnackbarProvider 
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        </>
    )
}