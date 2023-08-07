import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, LinearProgress, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useReducer, useRef, useState } from "react";
import { useLoaderData, useNavigate, useRouteLoaderData } from "react-router-dom";
import ButtonJoy from "@mui/joy/Button";
import EditIcon from '@mui/icons-material/Edit';
import { API, cookies } from "../../Services/Api";
import { SnackbarProvider, enqueueSnackbar,  } from "notistack";
import { Done, Verified } from "@mui/icons-material";
import { Revalidate, logoutUser, setRevalidate } from "../../Services/Auth";

function formReducer(state, action)
{

    if (action.type === 'clear_validation') return {
        avatar: state.avatar,
        name: {
            ...state.name,
            isError: false,
            errMsg: []
        },
        username: {
            ...state.username,
            isError: false,
            errMsg: []
        },
        email: {
            ...state.email,
            isError: false,
            errMsg: []
        },
        phone: {
            ...state.phone,
            isError: false,
            errMsg: []
        },
        password: {
            ...state.password,
            isError: false,
            errMsg: []
        }
    }
    if (action.changeValue) switch (action.changeValue) {
        case 'avatar': return {
            ...state,
            avatar: action.avatar
        }
        case 'name': return {
            ...state,
            name : {
                ...state.name,
                ...action.name
            }
        }
        case 'username': return {
            ...state,
            username : {
                ...state.username,
                ...action.username
            }
        }
        case 'email': return {
            ...state,
            email : {
                ...state.email,
                ...action.email
            }
        }
        case 'phone': return {
            ...state,
            phone : {
                ...state.phone,
                ...action.phone
            }
        }
        case 'password': return {
            ...state,
            password : {
                ...state.password,
                ...action.password
            }
        }
    }


}

export default function Profile(){
    let data = useRouteLoaderData('dashboard')
    const GetUserLoad = () => {
        data = useRouteLoaderData('dashboard')
    }
    const userFormState = {
        avatar: null,
        name: {
            value: '',
            isError: false,
            errMsg: []
        },
        username: {
            value: '',
            isError: false,
            errMsg: []
        },
        email: {
            value: '',
            isError: false,
            errMsg: []
        },
        phone: {
            value: '',
            isError: false,
            errMsg: []
        },
        password: {
            value: '',
            isError: false,
            errMsg: []
        }
    }
    const [userForm, setUserForm] = useReducer(formReducer, userFormState)
    const [user, setUser] = useState({})
    const inputAvatar = useRef(null)
    const [nik, setNik] = useState('')
    const [ktp, setKtp] = useState('')
    const photoKTPRef = useRef()

    // DOM Action Variable 
    const [credentialOpen, setCredentialOpen] = useState(false)
    const [Submitting, setSubmitting] = useState(false)
    const [SubmittingProfile, setSubmitProfile] = useState(true)
    const [isInputCredentials, setIsInputCredentials] = useState(false)
    const [isHasChanges, setIsHasChanges] = useState(false)
    const [openDialogSubmit, setOpenDialogSubmit] = useState(false)
    // END DOM Action Variable 

    // Error Callback Variable 
    const [errNik, setErrNik] = useState([])
    const [errKtp, setErrKtp] = useState([])
    const [errPhotoKtp, setErrPhotoKtp] = useState([]) 
    // End Error CallBack Variable 

    const navigate = useNavigate()


    const setProfile = () => {
        setUserForm({changeValue: 'username', username: {value: data.user?.username}})
        setUserForm({changeValue: 'name', name: {value: data.user?.name}})
        setUserForm({changeValue: 'email', email: {value: data.user?.email}})
        setUserForm({changeValue: 'phone', phone: {value: data.user?.phone ?? ''}})
        setUserForm({changeValue: 'avatar', avatar: `${process.env.REACT_APP_URL_IMAGE}profiles/${data.user?.photo}`})
        }


    const clearValidation = () => {
        setErrKtp([])
        setErrNik([])
        setErrPhotoKtp([])
        setUserForm({type: 'clear_validation'})
        inputAvatar.current.value = null
    }
    const handleAvatar = (target) => {
        setUserForm({changeValue: 'avatar', avatar: target})
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

        await API.postForm('user/verification', formData)
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
                setSubmitting(false)
                return
            }
        })
    }

    
    const makeSureSubmitProfiles = () => {
        if (userForm.email.value !== data.user?.email || userForm.password.value !== '') return setOpenDialogSubmit(true)

        return submitProfiles()
    }

    const cancelMakeSureSubmitProfiles = () => {
        setSubmitProfile(false)
        setOpenDialogSubmit(false)
    }


    const submitProfiles = async() => {
        setRevalidate(false)
        setSubmitProfile(true)
        const formData = new FormData()
        if (inputAvatar.current.value !== null || inputAvatar.current.value !== '') await formData.append('photo', inputAvatar.current.files[0] ?? null)
        await formData.append('username', userForm.username.value)
        await formData.append('name', userForm.name.value)
        await formData.append('email', userForm.email.value)
        if (userForm.phone.value !== '') await formData.append('phone', userForm.phone.value)
        if (userForm.password.value !== '') await formData.append('password', userForm.password.value)

        await API.postForm('user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
            }
        })
        .then((res) => {
            if (res.status !== 200) return
            if (userForm.email.value !== data.user?.email || userForm.password.value !== '') {
                logoutUser(true)
            }
            setRevalidate(true)
            setIsHasChanges(false)
            setSubmitProfile(false)
            clearValidation()
            enqueueSnackbar(res.data.message, {
                variant: 'success'
            })
            checkValidSubmitProfiles()
            return navigate('/dashboard/profiles/' + userForm.username.value)
            // GetUserLoad()
        })
        .catch((err) => {
            if (err.response?.status !== 400) return

            let errors = err.response.data.errors

            setUserForm({
                changeValue: 'name',
                name: {
                    isError: !errors.name ? false : true,  
                    errMsg: errors?.name ?? []
                }
            })

            setUserForm({
                changeValue: 'username',
                username: {
                    isError: !errors.username ? false : true,  
                    errMsg: errors?.username ?? []
                }
            })

            setUserForm({
                changeValue: 'email',
                email: {
                    isError: !errors.email ? false : true,  
                    errMsg: errors?.email ?? []
                }
            })
            setUserForm({
                changeValue: 'phone',
                phone: {
                    isError: !errors.phone ? false : true,  
                    errMsg: errors?.phone ?? []
                }
            })
            setUserForm({
                changeValue: 'password',
                password: {
                    isError: !errors.password ? false : true,  
                    errMsg: errors?.password ?? []
                }
            })
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
        return setIsHasChanges(userForm.name.value !== user?.name || userForm.username.value !== user?.username || userForm.email.value !== user?.email || userForm.password.value !== '' || userForm.phone.value !== (user?.phone ?? '') || inputAvatar.current.value !== '')
    }

    const TextCredentialButton = () => {
        if (data.user?.state === 0) return 'Verify Credential'
        if (data.user?.state === 1) return 'Verifying...'
        if (data.user?.state === 2) return 'Verified'
    }


    useEffect(() => {
        setProfile()
        checkValidSubmitProfiles()
        setSubmitProfile(false)
        setUser( localStorage.getItem('__user') ? JSON.parse(localStorage.getItem('__user')) : {});
    }, [])

    useEffect(() => {
        checkValidSubmitProfiles()
        console.log(userForm.phone.value)
    }, [userForm, data, inputAvatar.current?.value])
    return (
        <>
        <Typography component={'h1'} fontSize={'36px'}>Profile</Typography>
        <Grid container columnSpacing={2}>
            <Grid item xs={12} justifyContent={'center'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <input ref={inputAvatar} type="file" style={{ display: 'none' }} onChange={(e) => {handleAvatar( inputAvatar.current.value ? URL.createObjectURL(e.target?.files[0]) : `${process.env.REACT_APP_URL_IMAGE}profiles/${data.user?.photo}`);}} />
                    <Avatar sx={{ bgcolor: 'grey', width: 72, height: 72 }}  children={user?.avatar === 'avatar.png' ? user?.username.toString().toUpperCase().split(' ')[0][0] : undefined} src={userForm.avatar ? userForm.avatar : user?.photo}/>
                <br />
                <Typography component={'h2'} sx={{ ':hover': {cursor: 'pointer'} }} onClick={() => inputAvatar.current.click()}>Edit Photo Profile <EditIcon sx={{ fontSize: '12px' }} /></Typography>
            </Grid> 
            <Grid item xs={12} sx={{ marginTop: '1rem' }} >
                <Stack direction={'column'}  sx={{ justifyContent: 'center', display: 'flex', }} flexWrap={'wrap'} >
                    <TextField required type="text" error={userForm.username.isError} helperText={userForm.username?.errMsg[0] ?? null} variant="outlined" sx={{ margin: '1rem' }} value={userForm.username.value} label={'Username'} onChange={(e) => {setUserForm({changeValue: 'username', username: {value: e.target.value}})}} />
                    <TextField required type="text" error={userForm.name.isError} helperText={userForm.name?.errMsg[0] ?? null} variant="outlined" sx={{ margin: '1rem' }} value={userForm.name.value} label={'Name'} onChange={(e) => setUserForm({changeValue: 'name', name: {value: e.target.value}})} />
                    {data.user?.role !== 2 ?
                    <TextField required error={userForm.phone.isError} helperText={userForm.phone.errMsg[0] ?? null} type={'number'} variant="outlined" color={!userForm.phone.value || userForm.phone.value === '' ? 'warning' : undefined} sx={{ margin: '1rem' }} value={userForm.phone.value } label={'Phone'} placeholder="Input Phone Number" onChange={(e) => setUserForm({changeValue: 'phone', phone: {value: e.target.value}})} />
                    : undefined
                    }
                    <TextField required type="email" error={userForm.email.isError} helperText={userForm.email?.errMsg[0] ?? null} variant="outlined" sx={{ margin: '1rem' }} value={userForm.email.value} label={'Email'} onChange={(e) => setUserForm({changeValue: 'email', email: {value: e.target.value}})} />
                    <TextField error={userForm.password.isError} helperText={userForm.password.errMsg[0] ?? 'Please fill if you want change'} type="password" variant="outlined" sx={{ margin: '1rem' }} value={userForm.password.value} label={'Password'} onChange={(e) => setUserForm({changeValue: 'password', password: {value: e.target.value}})} />
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