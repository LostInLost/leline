import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export default function PageError({errorCode}) {
    const code = errorCode
    return (
        <>
        <Box sx={{ 
            backgroundColor: "white",
            width: '100vw',
            
         }}>

        
        <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
         }}>
            {code === 404 ?
            <>
            <Typography component={'h1'} fontSize={'36px'} textAlign={'center'}>404</Typography>
            <h3>Oops, the page is not found</h3>
            </>
            : undefined
            }
            {code === 502 ?
            <>
            <Typography component={'h1'} fontSize={'36px'} textAlign={'center'}>502</Typography>
            <h3>Oops, bad gateaway</h3>
            </>
            : undefined
            }
            {code === 401 ?
            <>
            <Typography component={'h1'} fontSize={'36px'} textAlign={'center'}>401</Typography>
            <h3>Unauthorized</h3>
            </>
            : undefined
            }
            
        </Box>

        </Box>
        </>
    )
}