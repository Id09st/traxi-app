import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, InputAdornment, Button, CardContent, Grid, Drawer, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import CircleIcon from '@mui/icons-material/Circle';
import MainCard from '../../ui-component/cards/MainCard';
import ManagerForm from './ManagerForm';
import UpdateManager from './UpdateManager';
import { getAllManager } from 'api/manager';

function ManagerTable() {
  const [isOpenManagerForm, setIsOpenManagerForm] = useState(false);
  const [isOpenUpdateManager, setIsOpenUpdateManager] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
  const [managers, setManagers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 80, totalRows: 0, totalPages: 0 });

  useEffect(() => {
    fetchManagers(pagination.currentPage, pagination.pageSize);
  }, [pagination.currentPage, isOpenManagerForm, isOpenUpdateManager]);

  useEffect(() => {
    const filteredManagers = managers.filter((manager) => manager.name.toLowerCase().includes(searchText.toLowerCase()));
    setManagers(filteredManagers);
  }, [searchText]);

  const fetchManagers = async (currentPage, pageSize) => {
    try {
      const { pagination, data } = await getAllManager(currentPage, pageSize);
      setPagination(pagination);
      setManagers(data.map(({ Id, Name, Role, Status }) => ({ id: Id, name: Name, role: Role, status: Status })));
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const handleViewManager = (managerId) => {
    const manager = managers.find((manager) => manager.id === managerId);
    if (manager) {
      setSelectedManagerId(managerId);
      setIsOpenUpdateManager(true);
    } else {
      console.log('Manager not found');
    }
  };

  const columns = [
    { field: 'name', headerName: 'Tên', width: 350 },
    { field: 'role', headerName: 'Vai trò', width: 300 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
      headerAlign: 'center',
      renderCell: ({ value }) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <CircleIcon style={{ color: value ? 'green' : 'red' }} />
        </div>
      )
    },
    {
      headerAlign: 'center',
      width: 130,
      renderCell: ({ row }) => (
        <IconButton onClick={() => handleViewManager(row.id)} color="info">
          <InfoIcon />
        </IconButton>
      )
    }
  ];

  return (
    <MainCard title="Danh sách Manager" contentSX={{ p: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Tìm kiếm Manager"
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
          <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end">
            <Button variant="contained" size="small" onClick={() => setIsOpenManagerForm(true)}>
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
        <Drawer anchor="right" open={isOpenManagerForm} onClose={() => setIsOpenManagerForm(false)}>
          <ManagerForm setIsOpen={setIsOpenManagerForm} />
        </Drawer>
        <Drawer anchor="right" open={isOpenUpdateManager} onClose={() => setIsOpenUpdateManager(false)}>
          <UpdateManager setIsOpen={setIsOpenUpdateManager} managerId={selectedManagerId} />
        </Drawer>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={managers}
            pageSize={pagination.pageSize}
            rowCount={pagination.totalRows}
            pagination
            page={pagination.currentPage - 1}
            onPageChange={(newPage) => setPagination((prev) => ({ ...prev, currentPage: newPage + 1 }))}
            columns={columns}
          />
        </div>
      </CardContent>
    </MainCard>
  );
}

export default ManagerTable;
