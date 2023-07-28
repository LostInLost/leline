import Typography from '@mui/material/Typography';
import { Box, Popper, styled, Button, Stack, MenuList, Popover, Container, Modal, FormControlLabel, Checkbox, Card, CardActionArea, CardMedia, CardContent, Grid } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Navbar from '../Layouts/Navbar';
import { useLoaderData } from 'react-router-dom';

export default function HomePage() {
  const URL = process.env.REACT_APP_URL_IMAGE;
  const [openFilter, setOpenFilter] = useState(false);
  const [anchorFilter, setAnchorFilter] = useState(null);
  const [auctionItems, setAuctionItems] = useState([1, 2, 3, 4, 5, 6]);
  const [fixedFilter, setFixedFilter] = useState(false);
  // const userData = useLoaderData();
  const handleOpenFilter = (e) => {
    setAnchorFilter(e.currentTarget);
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const FilterPage = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    padding: '0.3rem',
    outline: '2px solid lightblue',
    boxShadow: '0 0 8px 0 rgb(0,0,0,0.5)',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '25%',
      backgroundColor: 'white',
      color: 'black',
      padding: '20px',
      borderRadius: '1rem',
      width: '35%',
    },
  }));

  const BtnPrimary = styled(Button)(({ theme }) => ({
    width: '100%',
    backgroundColor: '#1769aa',
    color: 'white',
    ':hover': {
      backgroundColor: '#4dabf5',
    },
  }));

  const CardLeline = styled(Card)(({ theme }) => ({
    boxShadow: '4px 3px 4px 0 rgb(0,0,0,0.3)',
    outline: '1px solid rgb(0,0,0,0.3)',
    // width: '50%',
    [theme.breakpoints.up('sm')]: {
      // width: '100%',
      ':hover': {
        outline: '2px solid rgb(30,144,255)',
      },
    },
  }));

  useEffect(() => {
    // console.log(userData)
  }, [])
  return (
    <>
      <Navbar />
      <Container>
        <Box position={'sticky'}>
          <Button sx={{ color: 'black', marginTop: '10px' }} onMouseLeave={(e) => handleCloseFilter()} onMouseEnter={(e) => handleOpenFilter(e)} onClick={(e) => setFixedFilter(!fixedFilter)}>
            <FilterList sx={{ color: '#212121' }} /> Filter
          </Button>
          <Popper
            sx={{ marginTop: '1rem' }}
            modifiers={[
              {
                name: 'arrow',
                enabled: true,
                // options: {
                //   // element: arrowRef,
                // }
              },
            ]}
            placement="bottom-start"
            open={!fixedFilter ? openFilter : fixedFilter}
            anchorEl={anchorFilter}
          >
            <FilterPage alignItems={'center'} onMouseEnter={(e) => setOpenFilter(true)} onMouseLeave={(e) => handleCloseFilter(e)}>
              <MenuList>By Category</MenuList>
              <Stack direction={'row'} flexWrap={'wrap'}>
                <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
              </Stack>
            </FilterPage>
          </Popper>
          {/* <Modal open={openFilter} onClose={handleCloseFilter}>
              <FilterPage alignItems={'center'}>
                <Stack direction={'row'} justifyContent={{ sm: 'space-between', xs: 'center' }}>
                  <Typography variant="h4" sx={{ display: { sm: 'block', xs: 'none' } }}>
                    <FilterList fontSize="medium" /> Filter
                  </Typography>
                  <Button onClick={handleCloseFilter} sx={{ marginLeft: { sm: '0', xs: 'auto' } }}>
                    <Close sx={{ color: 'black' }} />
                  </Button>
                </Stack>
                <MenuList>By Category</MenuList>
                <Stack direction={'row'} flexWrap={'wrap'}>
                  <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                  <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                  <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                  <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                  <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                  <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                  <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                  <FormControlLabel label="Others" control={<Checkbox color="primary" />} />
                </Stack>
                <BtnPrimary>Search</BtnPrimary>
              </FilterPage>
            </Modal> */}
        </Box>

        <Box sx={{ marginTop: '1rem' }}>
          <Grid direction={'row'} container spacing={2} columns={12}>
            {auctionItems.map((data, key) => (
              <Grid key={key} item xl={2} sm={4} xs={6} onDragStart={(e) => e.preventDefault()}>
                <CardLeline>
                  <CardActionArea>
                    <CardMedia loading="lazy" component={'img'} height={'140px'} alt="Preview Image" image={ URL + "auctionitems/UW1GeVlXNW5JRUZ1ZEdsck1qQXlNeTB3Tmkwd05DQXhOVG94TVRvek13PT1CYXJhbmcgQW50aWsuanBn.jpg"} />
                    <CardContent>
                      <Typography variant="h6" textAlign={'center'} color="initial">
                        Auction Item
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </CardLeline>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
