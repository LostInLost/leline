import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, LinearProgress, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate, useRouteLoaderData } from "react-router-dom";
import ButtonJoy from "@mui/joy/Button";
import EditIcon from '@mui/icons-material/Edit';
import { Cookies } from "react-cookie";
import { SnackbarProvider, enqueueSnackbar,  } from "notistack";
import axios from "axios";
import { Done, Verified } from "@mui/icons-material";

export default function Profile(){
    const loaderData = useRouteLoaderData('dashboard')
    let data = loaderData
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [user, setUser] = useState({})
    const [avatar, setAvatar] = useState(null)
    const inputAvatar = useRef(null)
    const [email, setEmail] = useState('')
    const [nik, setNik] = useState('')
    const [ktp, setKtp] = useState('')
    
    const photoKTPRef = useRef()
    const [password, setPassword] = useState('')

    // DOM Action Variable 
    const [credentialOpen, setCredentialOpen] = useState(false)
    const [Submitting, setSubmitting] = useState(false)
    const [SubmittingProfile, setSubmitProfile] = useState(false)
    const [isInputCredentials, setIsInputCredentials] = useState(false)
    const [isHasChanges, setIsHasChanges] = useState(false)
    const [openDialogSubmit, setOpenDialogSubmit] = useState(false)
    // END DOM Action Variable 

    // Error Callback Variable 
    const [errNik, setErrNik] = useState([])
    const [errKtp, setErrKtp] = useState([])
    const [errPhotoKtp, setErrPhotoKtp] = useState([]) 
    const [errName, setErrName] = useState([])
    const [errUsername, setErrUsername] = useState([])
    const [errPhone, setErrPhone] = useState([])
    const [errEmail, setErrEmail] = useState([])
    const [errPassword, setErrPassword] = useState([])
    // End Error CallBack Variable 

    const navigate = useNavigate()
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
            console.log(res.data)
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
        setAvatar(`${process.env.REACT_APP_URL_IMAGE}profiles/${data.user?.photo}`)
        }


    const clearValidation = () => {
        setErrKtp([])
        setErrNik([])
        setErrPhotoKtp([])
        setErrName([])
        setErrEmail([])
        setErrUsername([])
        setErrPhone([])
        setErrPassword([])
        inputAvatar.current.value = null
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

    
    const makeSureSubmitProfiles = () => {
        if (email !== data.user?.email || password !== '') return setOpenDialogSubmit(true)

        return submitProfiles()
    }

    const cancelMakeSureSubmitProfiles = () => {
        setSubmitProfile(false)
        setOpenDialogSubmit(false)
    }

    const handleLogout = async() => {
    await API.postForm('logout', {}, {
      headers: {
        Authorization: 'Bearer ' + cookies.get('__token_'),
        Accept: 'application/json',
      }
    }).then((res) => {
      if (res.status !== 200) return
        localStorage.removeItem('__user');
      cookies.remove('__token_');
      return window.location.reload()

    }).catch((err) => {
        console.log(err)
    })
  }

    const submitProfiles = async() => {
        setSubmitProfile(true)

        const formData = new FormData()
        if (inputAvatar.current.value !== null || inputAvatar.current.value !== '') await formData.append('photo', inputAvatar.current.files[0] ?? null)
        await formData.append('username', username)
        await formData.append('name', name)
        await formData.append('email', email)
        if (phone !== '') await formData.append('phone', phone)
        if (password !== '') await formData.append('password', password)

        await API.postForm('user', formData, {
            headers: {
                Authorization: `Bearer ${cookies.get('__token_')}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            if (res.status !== 200) return
            if (email !== data.user?.email || password !== '') return handleLogout()
            inputAvatar.current.value = null
            navigate('/dashboard/profiles/' + username)
            setSubmitProfile(false)
            clearValidation()
            setIsHasChanges(false)
            return enqueueSnackbar(res.data.message, {
                variant: 'success'
            })
        })
        .catch((err) => {
            console.log(err)
            if (err.response.status !== 400) return

            let errors = err.response.data.errors

            setErrName(errors.name ?? [])
            setErrEmail(errors.email ?? [])
            setErrUsername(errors.username ?? [])
            setErrPassword(errors.password ?? [])
            setErrPhone(errors.phone ?? []) 
            setSubmitProfile(false)
            if (errors?.photo?.length > 0) return enqueueSnackbar(errors?.photo[0] ?? null, {
                variant: 'error'
            })
            return enqueueSnackbar('Profiles not successfully updated', {
                variant: 'error'
            })
        })
    }
    const checkInputCredentials = () => {
        if (!photoKTPRef.current?.files[0]) return setIsInputCredentials(false)

        return setIsInputCredentials(true)
    }

    const checkValidSubmitCredentials = () => {
        return !isInputCredentials || nik === null || nik === '' || ktp === null || ktp === ''
    }

    const checkValidSubmitProfiles = () => {
        let user = data.user
        return setIsHasChanges(name !== user?.name || (username !== user?.username && username.length !== 0) || email !== user?.email || password !== '' || phone !== user?.phone || inputAvatar.current.value !== '')
    }

    const TextCredentialButton = () => {
        if (data.user?.state === 0) return 'Verify Credential'
        if (data.user?.state === 1) return 'Verifying...'
        if (data.user?.state === 2) return 'Verified'
    }


    useEffect(() => {
        setProfile()
        setUser( localStorage.getItem('__user') ? JSON.parse(localStorage.getItem('__user')) : {});
    }, [])

    useEffect(() => {
        checkValidSubmitProfiles()
    }, [name, username, email, phone, password, inputAvatar.current?.value])
    return (
        <>
        <Typography component={'h1'} fontSize={'36px'}>Profile</Typography>
        <Grid container columnSpacing={2}>
            <Grid item xs={12} justifyContent={'center'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <input ref={inputAvatar} type="file" style={{ display: 'none' }} onChange={(e) => {handleAvatar( URL.createObjectURL(e.target.files[0]));}} />
                {/* <Avatar sx={{ bgcolor: 'grey', width: 72, height: 72 }}  children={user?.avatar === 'avatar.png' ? user?.username.toString().toUpperCase().split(' ')[0][0] : undefined} src={user?.avatar !== 'avatar.png'
                 ? user?.avatar : undefined} /> */}
                    <Avatar sx={{ bgcolor: 'grey', width: 72, height: 72 }}  children={user?.avatar === 'avatar.png' ? user?.username.toString().toUpperCase().split(' ')[0][0] : undefined} src={avatar ? avatar : user?.photo}/>
                <br />
                <Typography component={'h2'} sx={{ ':hover': {cursor: 'pointer'} }} onClick={() => inputAvatar.current.click()}>Edit Photo Profile <EditIcon sx={{ fontSize: '12px' }} /></Typography>
            </Grid> 
            <Grid item xs={12} sx={{ marginTop: '1rem' }} >
                <Stack direction={'column'}  sx={{ justifyContent: 'center', display: 'flex', }} flexWrap={'wrap'} >
                    <TextField required type="text" error={errUsername.length !== 0} helperText={errUsername[0] ?? null} variant="outlined" sx={{ margin: '1rem' }} value={username} label={'Username'} onChange={(e) => setUsername(e.target.value)} />
                    <TextField required type="text" error={errName.length !== 0} helperText={errName[0] ?? null} variant="outlined" sx={{ margin: '1rem' }} value={name} label={'Name'} onChange={(e) => setName(e.target.value)} />
                    {data.user?.role !== 2 ?
                    <TextField required error={errPhone.length !== 0} helperText={errPhone[0] ?? null} type={'number'} variant="outlined" color={!phone || phone === '' ? 'warning' : undefined} sx={{ margin: '1rem' }} value={phone} label={'Phone'} placeholder="Input Phone Number" onChange={(e) => setPhone(e.target.value)} />
                    : undefined
                    }
                    <TextField required type="email" error={errEmail.length !== 0} helperText={errEmail[0] ?? null} variant="outlined" sx={{ margin: '1rem' }} value={email} label={'Email'} onChange={(e) => setEmail(e.target.value)} />
                    <TextField error={errPassword.length !== 0} helperText={errPassword[0] ?? 'Please fill if you want change'} type="password" variant="outlined" sx={{ margin: '1rem' }} value={password} label={'Password'} onChange={(e) => setPassword(e.target.value)} />
                </Stack>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '1rem' }}>
                <Typography variant="subtitle1" color="initial">Credentials</Typography>
                {data.user?.state === 2 ?
                <Button variant="contained"  color="success" disableRipple disableElevation endIcon={<Verified />}>Verified </Button>
                :
                <Button disabled={data.user?.state !== 0} sx={{ margin: '1rem', }} onClick={() => openCredential()}  variant={"outlined"} >{TextCredentialButton()}</Button>
            }

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
                     <Button variant={'contained'} onClick={(e) => {
                        e.preventDefault()
                        makeSureSubmitProfiles()
                     }} sx={{ marginLeft: 'auto' }} disabled={!isHasChanges || SubmittingProfile}>{SubmittingProfile ? <CircularProgress size={24}  sx={{ color: 'white', display: 'block',  }} /> : 'Save Changes'} </Button>
            </Grid>
        </Grid>


        <SnackbarProvider 
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        <Dialog
        open={openDialogSubmit}
        >
        <DialogTitle>
            Are you sure to save changes?
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                You are already change <b>Email</b> or <b>Password</b>. So, we will make you automatically logout and You must login again
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {setOpenDialogSubmit(false); submitProfiles()}}>Save Changes</Button>
            <Button onClick={() => cancelMakeSureSubmitProfiles()}>Cancel</Button>
        </DialogActions>
        </Dialog>
        </>
    )
}