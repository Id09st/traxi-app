import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Dialog, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { banDriverById, getDriverById, updateDriverById } from 'api/driver'; // Assuming you have API functions for getting, updating, and banning driver by ID
import BlockIcon from '@mui/icons-material/Block';

export default function DriverUpdate({ driverId }) {
  const [driver, setDriver] = useState({
    fullname: '',
    imageurl: '',
    phone: '',
    address: '',
    password: '',
    degreeid: '',
    walletid: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State for controlling confirmation dialog
  const [errors, setErrors] = useState({}); // Define errors state variable

  useEffect(() => {
    getDriverData(driverId);
  }, [driverId]);

  const getDriverData = async (id) => {
    try {
      const data = await getDriverById(id);
      setDriver({
        Fullname: data.fullname,
        Imageurl: data.imageurl,
        Phone: data.phone,
        Address: data.address,
        Password: data.password,
        Degreeid: data.degreeid,
        Walletid: data.walletid
      });
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  const handleChange = (prop) => (event) => {
    setDriver({ ...driver, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateDriverById(driverId, driver);
      setSnackbarMessage('Driver updated successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating driver:', error);
      setSnackbarMessage('Error updating driver');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleBan = async () => {
    setOpenConfirmDialog(true); // Open confirmation dialog
  };

  const handleConfirmBan = async () => {
    setOpenConfirmDialog(false); // Close confirmation dialog
    try {
      await banDriverById(driverId);
      setSnackbarMessage('Driver banned successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error banning driver:', error);
      setSnackbarMessage('Error banning driver');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCancelBan = () => {
    setOpenConfirmDialog(false); // Close confirmation dialog
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h3" gutterBottom sx={{ padding: '16px 5px' }}>
        Update Driver
      </Typography>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1 }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={errors.fullname}
              id="outlined-fullname"
              label="Full Name"
              value={driver.fullname}
              onChange={handleChange('fullname')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.imageurl}
              id="outlined-imageurl"
              label="Image URL"
              value={driver.imageurl}
              onChange={handleChange('imageurl')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.phone}
              id="outlined-phone"
              label="Phone"
              value={driver.phone}
              onChange={handleChange('phone')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.address}
              id="outlined-address"
              label="Address"
              value={driver.address}
              onChange={handleChange('address')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.password}
              id="foutlined-password"
              label="Password"
              value={driver.password}
              onChange={handleChange('password')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.degreeid}
              id="outlined-degreeid"
              label="Degree ID"
              value={driver.degreeid}
              onChange={handleChange('degreeid')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.walletid}
              id="outlined-walletid"
              label="Wallet ID"
              value={driver.walletid}
              onChange={handleChange('walletid')}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item>
            <Button type="button" color="error" variant="outlined" onClick={handleBan}>
              <BlockIcon />
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" color="primary" variant="contained">
              Update Driver
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCancelBan}>
        <DialogTitle>Are you sure you want to ban this driver?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action will ban the driver and cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmBan} color="error">
            Yes
          </Button>
          <Button onClick={handleCancelBan} color="primary" variant="contained">
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
