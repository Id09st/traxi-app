import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import useDriverForm from 'hooks/useDriverForm';
import { Typography } from '@mui/material';
import { addDriver } from 'api/driver';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DriverForm({ setIsOpen, setReload }) {
  const { driver, errors, handleChange, validate } = useDriverForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      addDriver(driver)
        .then((data) => {
          console.log('Driver mới đã được thêm thành công:', data);
          setSnackbarMessage('Driver mới đã được thêm thành công');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setIsOpen(false);
          setReload((prev) => !prev); // Đóng form sau khi thêm thành công
        })
        .catch((error) => {
          console.error('Lỗi khi thêm driver:', error);
          setSnackbarMessage('Có lỗi xảy ra khi thêm driver');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        });
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
        Thêm Driver Mới
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
              helperText={errors.fullname ? 'Không được để trống' : ''}
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
              helperText={errors.imageurl ? 'Phải là một link URL chứa hình ảnh' : ''}
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
              helperText={errors.phone ? 'Phone là số 10 số và bắt đầu bằng số 0' : ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField id="outlined-address" label="Address" value={driver.address} onChange={handleChange('address')} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.degreeid}
              id="outlined-degreeid"
              label="Degree ID"
              value={driver.degreeid}
              onChange={handleChange('degreeid')}
              helperText={errors.degreeid ? 'Chỉ nhập số' : ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField id="outlined-walletid" label="Wallet ID" value={driver.walletid} onChange={handleChange('walletid')} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-password"
              label="Password"
              value={driver.password}
              onChange={handleChange('password')}
              type="password"
              fullWidth
            />
          </Grid>
        </Grid>
        <Button type="submit" color="primary" variant="contained" style={{ marginTop: '20px' }}>
          Create Driver
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
