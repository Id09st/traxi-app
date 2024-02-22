import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import useManagerForm from 'hooks/useManagerForm'; // Assuming you have a hook for manager form
import { Typography } from '@mui/material';
import { addManager } from 'api/manager'; // Assuming you have an API function for adding manager
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';

const CustomAlert = React.forwardRef(function CustomAlert(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ManagerForm({ setIsOpen }) {
  const { manager, errors, handleChange, validate } = useManagerForm();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      addManager(manager)
        .then((data) => {
          console.log('Manager mới đã được thêm thành công:', data);
          setSnackbarMessage('Manager mới đã được thêm thành công');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          setIsOpen(false); // Đóng form sau khi thêm thành công
        })
        .catch((error) => {
          console.error('Lỗi khi thêm manager:', error);
          setSnackbarMessage('Có lỗi xảy ra khi thêm manager');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h3" gutterBottom sx={{ padding: '16px 5px' }}>
        Thêm Manager Mới
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
              error={errors.name}
              id="outlined-name"
              label="Name"
              value={manager.name}
              onChange={handleChange('name')}
              helperText={errors.name ? 'Tên phải chứa cả chữ và số' : ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={errors.password}
              id="outlined-password"
              label="Password"
              value={manager.password}
              onChange={handleChange('password')}
              type={showPassword ? 'text' : 'password'}
              helperText={errors.password ? 'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt' : ''}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
        <Button type="submit" color="primary" variant="contained" style={{ marginTop: '20px' }}>
          Create Manager
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
