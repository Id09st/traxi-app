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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [errors, setErrors] = useState({}); // Define errors state variable

  useEffect(() => {
    getDriverData(driverId);
  }, [driverId]);

  const getDriverData = async (id) => {
    try {
      const data = await getDriverById(id);
      setDriver({
        fullname: data.FullName,
        imageurl: data.ImageUrl,
        phone: data.Phone,
        address: data.Address,
        walletid: data.WalletId,
        status: data.Status
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
    try {
      await banDriverById(driverId);
      // Gọi hàm được truyền qua props để cập nhật trạng thái
      props.onUpdateDriverStatus(driverId, 'banned');
      setOpenConfirm(false);
      // Hiển thị thông báo thành công
      setSnackbarMessage('Driver đã bị ban thành công.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Lỗi khi khóa tài khoản:', error);
      // Hiển thị thông báo lỗi
      setSnackbarMessage('Lỗi khi khóa tài khoản.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
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
        Chỉnh sửa hồ sơ Tài xế
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
              label="Họ và tên"
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
              label="Số điện thoại"
              value={driver.phone}
              onChange={handleChange('phone')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.address}
              id="outlined-address"
              label="Địa chỉ"
              value={driver.address}
              onChange={handleChange('address')}
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
            <Button type="button" color="error" variant="outlined" onClick={() => setOpenConfirm(true)}>
              <BlockIcon />
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" color="primary" variant="contained">
              Cập nhật
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Xác nhận khóa tài khoản?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn khóa tài khoản này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Không</Button>
          <Button onClick={handleBan}>Có</Button>
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
