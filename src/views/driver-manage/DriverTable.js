import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, InputAdornment, IconButton, CardContent, Grid, Typography, Box, Drawer, Button } from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getAllDriver } from 'api/driver';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import DriverForm from './DriverForm';
import DriverUpdate from './DriverUpdate'; // Thêm import cho DriverUpdate
import useDriverForm from 'hooks/useDriverForm';

function DriverTable() {
  const [reload, setReload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDriverUpdate, setOpenDriverUpdate] = useState(false); // State để mở form DriverUpdate
  const [selectedDriverId, setSelectedDriverId] = useState(null); // State để lưu ID của lái xe được chọn
  const [drivers, setDrivers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { driver, errors, handleChange, validate } = useDriverForm(); // Sử dụng custom hook
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 80,
    totalRows: 0,
    totalPages: 0
  });
  const AvatarCell = ({ value }) => (
    <>
      <Stack direction="row" spacing={2}>
        <Avatar src={value} sx={{ width: 45, height: 45 }} />
      </Stack>
    </>
  );

  useEffect(() => {
    getDrivers(pagination.currentPage, pagination.pageSize);
  }, [reload, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    if (selectedDriverId) {
      setOpenDriverUpdate(true);
    }
  }, [selectedDriverId]);

  const columns = [
    // { field: 'id', headerName: 'ID', width: 320 },
    { field: 'fullname', headerName: 'Tên', width: 180 },
    {
      field: 'imageurl',
      headerName: 'Avatar',
      width: 180,
      renderCell: (params) => <AvatarCell value={params.value} />
    },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'address', headerName: 'Địa chỉ', width: 150 },
    { field: 'update', headerName: 'Ngày duyệt', width: 150 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 130,
      renderCell: (params) => (
        <div
          style={{
            height: '15px',
            width: '15px',
            backgroundColor: params.value ? 'green' : 'red',
            borderRadius: '50%'
          }}
        />
      )
    },
    {
      field: 'action',
      headerName: 'Hành động',
      width: 130,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="RemoveRedEyeOutlinedIcon"
            onClick={() => {
              setOpenDriverUpdate(true); // Mở form DriverUpdate khi nhấp vào nút "RemoveRedEyeOutlinedIcon"
              setSelectedDriverId(params.row.id); // Chọn lái xe dựa trên ID
            }}
            color="info"
          >
            <RemoveRedEyeOutlinedIcon />
          </IconButton>
        </>
      ),
      sortable: false
    }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const handlePageChange = (newPage) => {
    console.log('NewPage', newPage);
    getDrivers(newPage, pagination.pageSize);
  };

  const getDrivers = async (currentPage, pageSize) => {
    try {
      const listDrivers = await getAllDriver(currentPage, pageSize);
      if (listDrivers && listDrivers.pagination && listDrivers.data) {
        const { pagination, data } = listDrivers;
        setPagination({
          currentPage: pagination.currentPage,
          pageSize: pagination.pageSize,
          totalRows: pagination.totalRows,
          totalPages: pagination.totalPages
        });
        const transformedData = data.map((driver) => ({
          id: driver.Id,
          fullname: driver.FullName,
          imageurl: driver.ImageUrl,
          phone: driver.Phone,
          address: driver.Address,
          update: driver.UpDate,
          degreeid: driver.DegreeId,
          walletid: driver.WalletId,
          status: driver.Status,
          password: driver.Password
        }));
        setDrivers(transformedData);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  return (
    <MainCard title="Danh sách Driver" contentSX={{ p: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              placeholder="Tìm kiếm Driver theo tên"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{ width: '300px' }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" startIcon={<AddIcon />} onClick={toggleDrawer(true)}>
              Xét Duyệt hồ sơ Driver
            </Button>
          </Grid>
        </Grid>
        <Drawer
          anchor="right"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          sx={{
            width: 500,
            margin: 0,
            borderRadius: 0,
            maxHeight: '100%',
            '& .MuiDrawer-paper': {
              width: 500,
              margin: 0,
              borderRadius: 0,
              maxHeight: '100%'
            }
          }}
        >
          <DriverForm setIsOpen={setIsOpen} setReload={setReload} />
        </Drawer>
        {/* Thêm component DriverUpdate và truyền driverId vào nó */}
        <Drawer
          anchor="right"
          open={openDriverUpdate}
          onClose={() => setOpenDriverUpdate(false)}
          sx={{
            width: 500,
            margin: 0,
            borderRadius: 0,
            maxHeight: '100%',
            '& .MuiDrawer-paper': {
              width: 500,
              margin: 0,
              borderRadius: 0,
              maxHeight: '100%'
            }
          }}
        >
          <DriverUpdate driverId={selectedDriverId} />
        </Drawer>
      </CardContent>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={drivers}
          columns={columns}
          pageSize={pagination.pageSize}
          rowCount={pagination.totalRows}
          pagination
          page={pagination.currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </MainCard>
  );
}

export default DriverTable;
