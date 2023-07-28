import styled from "@emotion/styled";
import { Box, List, ListItemButton, ListItemText, ListSubheader } from "@mui/material";


export default function SideBar() {

    const ListItemButtonStyled = styled(ListItemButton)(({theme}) => ({
        ':hover': {
            borderRadius: '0.5rem',
        },
        "active='1'": {
            backgroundColor: 'black'
        },
        
    }))
    return (
        <>
        <Box sx={{ width: '200px' }}>
        <List component={'nav'} id="list-profile" 
        subheader={
            <ListSubheader component={'span'} sx={{ backgroundColor: 'transparent', color: 'whitesmoke' }}>
                Profiles
            </ListSubheader>
        }>
            <ListItemButtonStyled active={'1'}>
                <ListItemText sx={{ color: 'white' }} primary={'My Profile'} />
            </ListItemButtonStyled>
        </List>
        </Box>
        </>
    )
}