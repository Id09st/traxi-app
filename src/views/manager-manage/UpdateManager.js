import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import BlockIcon from '@mui/icons-material/Block';
import { banManagerById, getManagerById, updateManagerById } from 'api/manager'; // Assuming you have API functions for getting, updating, and banning manager by ID

export default function UpdateManager({ setIsOpen, managerId }) {
  const [manager, setManager] = useState({
    name: '',
    password: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State for controlling confirmation dialog

  useEffect(() => {
    getManagerData(managerId);
  }, [managerId]);

  const getManagerData = async (id) => {
    try {
      const data = await getManagerById(id);
      setManager({
        name: data.Name,
        password: data.Password
      });
    } catch (error) {
      console.error('Error fetching manager data:', error);
    }
  };

  const handleChange = (prop) => (event) => {
    setManager({ ...manager, [prop]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateManagerById(managerId, manager);
      setSnackbarMessage('Thông tin quản lý đã được cập nhật thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsOpen(false);
    } catch (error) {
      console.error('Có lỗi khi cập nhật thông tin quản lý:', error);
      setSnackbarMessage('Có lỗi xảy ra khi cập nhật thông tin quản lý');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleBan = async () => {
    setOpenConfirmDialog(true); // Mở dialog xác nhận
  };

  const handleConfirmBan = async () => {
    setOpenConfirmDialog(false); // Đóng dialog xác nhận
    try {
      await banManagerById(managerId);
      setSnackbarMessage('Quản lý đã được ban thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsOpen(false);
    } catch (error) {
      console.error('Có lỗi khi ban quản lý:', error);
      setSnackbarMessage('Có lỗi xảy ra khi ban quản lý');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCancelBan = () => {
    setOpenConfirmDialog(false); // Đóng dialog xác nhận
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
        Update Manager
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
            <TextField id="outlined-name" label="Name" value={manager.name} onChange={handleChange('name')} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField id="outlined-password" label="Password" value={manager.password} onChange={handleChange('password')} fullWidth />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item>
            <Button type="button" color="error" variant="outlined" onClick={handleBan}>
              <BlockIcon/>
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" color="primary" variant="contained">
              Update Manager
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCancelBan}>
        <DialogTitle>Bạn có muốn cấm tài khoản này?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thao tác này sẽ cấm tài khoản và không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmBan} color="error">
            Có
          </Button>
          <Button onClick={handleCancelBan} color="primary" variant="contained">
            Không
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
