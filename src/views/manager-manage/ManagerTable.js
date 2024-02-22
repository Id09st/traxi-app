import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, InputAdornment, Button, CardContent, Grid, Drawer, IconButton } from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ManagerForm from './ManagerForm';
import UpdateManager from './UpdateManager';
import { getAllManager } from 'api/manager';

function ManagerTable() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 400 },
    { field: 'name', headerName: 'Tên', width: 350 },
    { field: 'role', headerName: 'Vai trò', width: 300 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 250,
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
      headerName: 'Điều Chỉnh',
      width: 130,
      renderCell: (params) => (
        <>
          <IconButton aria-label="MoreOutlinedIcon" onClick={() => handleViewManager(params.row.id)} color="info">
            <RemoveRedEyeOutlinedIcon />
          </IconButton>
        </>
      ),
      sortable: false
    }
  ];

  const [isOpenManagerForm, setIsOpenManagerForm] = useState(false);
  const [isOpenUpdateManager, setIsOpenUpdateManager] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [managers, setManagers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 80,
    totalRows: 0,
    totalPages: 0
  });

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpenManagerForm(open);
  };

  const handleViewManager = (managerId) => {
    // Tìm manager trong mảng managers dựa trên managerId
    const manager = managers.find((manager) => manager.id === managerId);
    if (manager) {
      console.log('Manager data:', manager);
      setSelectedManagerId(managerId);
      setIsOpenUpdateManager(true);
    } else {
      console.log('Manager not found');
    }
  };

  const handlePageChange = (newPage) => {
    getManagers(newPage, pagination.pageSize);
  };

  useEffect(() => {
    getManagers(pagination.currentPage, pagination.pageSize);
  }, []);

  useEffect(() => {
    if (!isOpenUpdateManager) {
      getManagers(pagination.currentPage, pagination.pageSize);
    }
  }, [isOpenUpdateManager]);

  useEffect(() => {
    if (!isOpenManagerForm) {
      getManagers(pagination.currentPage, pagination.pageSize);
    }
  }, [isOpenManagerForm]);

  const getManagers = async (currentPage, pageSize) => {
    try {
      const result = await getAllManager(currentPage, pageSize);
      if (result && result.pagination && result.data) {
        const { pagination, data } = result;
        setPagination({
          currentPage: pagination.currentPage,
          pageSize: pagination.pageSize,
          totalRows: pagination.totalRows,
          totalPages: pagination.totalPages
        });
        const transformedData = data.map((manager) => ({
          id: manager.Id,
          name: manager.Name,
          role: manager.Role,
          status: manager.Status
        }));
        setManagers(transformedData);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };
  

  useEffect(() => {
    const filteredManagers = managers.filter((manager) =>
      manager.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setManagers(filteredManagers);
  }, [searchText]);

  return (
    <MainCard title="Danh sách Manager" contentSX={{ p: 2 }}>
      <CardContent>
        <Grid
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexFlow: 'wrap',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: '-16px',
            width: 'calc(100% + 16px)',
            marginLeft: '-16px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              placeholder="Tìm kiếm Manager"
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
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              size="small"
              title="Add Manager"
              aria-label="Add Manager"
              style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                minWidth: 'auto',
                boxShadow: 'none',
                backgroundColor: '#1976d2',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              }}
              onClick={toggleDrawer(true)}
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
        <Drawer
          anchor="right"
          open={isOpenManagerForm}
          onClose={() => setIsOpenManagerForm(false)}
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
          <ManagerForm setIsOpen={setIsOpenManagerForm} />
        </Drawer>

        <Drawer
          anchor="right"
          open={isOpenUpdateManager}
          onClose={() => setIsOpenUpdateManager(false)}
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
          <UpdateManager setIsOpen={setIsOpenUpdateManager} managerId={selectedManagerId} />
        </Drawer>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={managers}
            pageSize={pagination.pageSize}
            rowCount={pagination.totalRows}
            pagination
            page={pagination.currentPage}
            onPageChange={handlePageChange}
            columns={columns}
          />
        </div>
      </CardContent>
    </MainCard>
  );
}

export default ManagerTable;
