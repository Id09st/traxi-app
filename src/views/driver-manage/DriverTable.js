import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, InputAdornment, IconButton, CardContent, Grid, Drawer, Button, Tooltip } from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getAllDriver } from 'api/driver';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import DriverForm from './DriverForm';
import DriverUpdate from './DriverUpdate';
import useDriverForm from 'hooks/useDriverForm';
import CircleIcon from '@mui/icons-material/Circle';

function DriverTable() {
  const [reload, setReload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDriverUpdate, setOpenDriverUpdate] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { driver, errors, handleChange, validate } = useDriverForm();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 80,
    totalRows: 0,
    totalPages: 0
  });
  const AvatarCell = ({ value }) => (
    <Stack direction="row" spacing={2}>
      <Avatar src={value} sx={{ width: 45, height: 45 }} />
    </Stack>
  );

  useEffect(() => {
    getDrivers(pagination.currentPage, pagination.pageSize, searchText);
  }, [reload, pagination.currentPage, pagination.pageSize, searchText]);

  useEffect(() => {
    if (selectedDriverId) {
      setOpenDriverUpdate(true);
    }
  }, [selectedDriverId]);

  const columns = [
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
      width: 150,
      headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <CircleIcon style={{ color: params.value ? 'green' : 'red' }} />
        </div>
      )
    },
    {
      width: 130,
      headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Tooltip title="Xem thông tin">
            <IconButton
              aria-label="RemoveRedEyeOutlinedIcon"
              onClick={() => {
                setOpenDriverUpdate(true);
                setSelectedDriverId(params.row.id);
              }}
              color="info"
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </div>
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
    getDrivers(newPage + 1, pagination.pageSize, searchText);
  };

  // Trong DriverTable component

  const updateDriverStatus = (driverId, newStatus) => {
    setDrivers(
      drivers.map((driver) => {
        if (driver.id === driverId) {
          return { ...driver, status: newStatus };
        }
        return driver;
      })
    );
    // Đánh dấu để làm mới danh sách sau khi cập nhật
    setReload((prev) => !prev);
  };

  // Khi render DriverUpdate component, truyền prop updateDriverStatus
  <DriverUpdate driverId={selectedDriverId} onUpdateDriverStatus={updateDriverStatus} />;

  const getDrivers = async (currentPage, pageSize, searchText = '') => {
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
        const transformedData = data
          .filter((driver) => driver.FullName.toLowerCase().includes(searchText.toLowerCase()))
          .map((driver) => ({
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
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              placeholder="Tìm kiếm Driver theo tên"
              value={searchText}
              style={{ paddingBottom: '10px' }}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item>
            <Tooltip title="Thêm Driver mới">
              <Button variant="contained" startIcon={<AddIcon />} onClick={toggleDrawer(true)}>
                Xét Duyệt hồ sơ Driver
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
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
          <DriverUpdate driverId={selectedDriverId} onUpdateDriverStatus={updateDriverStatus} />
        </Drawer>
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
          page={pagination.currentPage - 1}
          onPageChange={handlePageChange}
        />
      </div>
    </MainCard>
  );
}

export default DriverTable;
