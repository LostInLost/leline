import { Avatar, Box, Button, Grid, Input, LinearProgress, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';

export default function Profile(){
    const data = useLoaderData()
    const [username, setUsername] = useState(null)
    const [name, setName] = useState(null)
    const [phone, setPhone] = useState(null)
    const [user, setUser] = useState({})
    const [avatar, setAvatar] = useState(null)
    const inputAvatar = useRef(null)
    const [email, setEmail] = useState(null)
    const emailRef = useRef()
    const photoKTPRef = useRef()
    const [password, setPassword] = useState(null)
    const [credentialOpen, setCredentialOpen] = useState(false)

    const handleAvatar = (target) => {
        setAvatar(target)
    }

    const openCredential = () => {
        setCredentialOpen(true)
    }

    const TextCredentialButton = () => {
        if (data.user?.state === 0) return 'Verify Credential'
        if (data.user?.state === 1) return 'Verifying...'
        if (data.user?.state === 2) return 'Verified'
    }
    useEffect(() => {
        setUsername(data.user?.username)
        setName(data.user?.name)
        setEmail(data.user?.email)
        setPhone(data.user?.phone)
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
            <Grid item xs={6} sx={{ marginTop: '1rem' }} >
                <Stack direction={'row'}  sx={{ justifyContent: 'center', display: 'flex', }} flexWrap={'wrap'} >
                    <TextField type="text" variant="outlined" sx={{ margin: '1rem' }} value={username} label={'Username'} onChange={(e) => setUsername(e.target.value)} />
                    <TextField type="text" variant="outlined" sx={{ margin: '1rem' }} value={name} label={'Name'} onChange={(e) => setName(e.target.value)} />
                    <TextField type={'number'} variant="outlined" focused color={!phone || phone === '' ? 'warning' : undefined} sx={{ margin: '1rem' }} value={phone} label={'Phone'} placeholder="Input Phone Number" onChange={(e) => setPhone(e.target.value)} />
                    <TextField type="email" variant="outlined" sx={{ margin: '1rem' }} value={email} label={'Email'} onChange={(e) => setEmail(e.target.value)} />
                    <TextField helperText={'Please fill if you want change'} type="password" variant="outlined" sx={{ margin: '1rem' }} value={password} label={'Password'} onChange={(e) => setPassword(e.target.value)} />
                </Stack>
            </Grid>
            <Grid item xs={6} sx={{ marginTop: '1rem' }}>
                <Typography variant="subtitle1" color="initial" >Status Credential</Typography>
                <Button disabled={data.user?.state === 1} sx={{ margin: '1rem' }} onClick={() => openCredential()}  variant="outlined">{TextCredentialButton()}</Button>
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
                    <Typography sx={{ 
                        color: 'dark'
                     }} variant="subtitle1" id={'credential-title'} color="initial">Verify Your Credential</Typography>
                    <LinearProgress sx={{ width: '100%' }} variant="determinate" value={67} />
                    <Stack direction={'row'}>
                        <TextField type="file" inputRef={photoKTPRef} sx={{ display: 'none' }} />
                        <Button variant="filled" sx={{ backgroundColor: '#4287f5', margin: '0.5rem' }} onClick={() => photoKTPRef.current.click()}>Upload KTP</Button>
                    </Stack>
                    <Box sx={{ 
                        display: 'flex',
                        marginTop: 'auto'
                     }}>
                        <Button variant="filled" sx={{ backgroundColor: '#42f557', margin: '0.5rem' }}>Submit</Button>
                        <Button onClick={() => setCredentialOpen(false)} variant="filled" sx={{ backgroundColor: '#42f557', margin: '0.5rem' }}>Cancel</Button>
                    </Box>
                </Box>
                </Modal>
            </Grid>
        </Grid>
        </>
    )
}