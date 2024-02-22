import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Container from '@mui/material/Container';
import MainCard from '../../ui-component/cards/MainCard';
import { TextField, InputAdornment, Button, CardContent, Grid, Drawer } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getAllManager } from 'api/manager';

function List(props) {
    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'role', headerName: 'Role', width: 150 },
        {
            field: 'action',
            headerName: 'Hành động',
            width: 130,
            renderCell: (params) => (
                <>
                    <IconButton
                        aria-label="RemoveRedEyeOutlinedIcon"
                        onClick={() => {
                            // Thêm hành động chỉnh sửa tại đây
                        }}
                        color="info"
                    >
                        <RemoveRedEyeOutlinedIcon />
                    </IconButton>
                    <IconButton
                        aria-label="ModeEditOutlineOutlinedIcon"
                        onClick={() => {
                            // Thêm hành động xóa tại đây
                        }}
                    >
                        <ModeEditOutlineOutlinedIcon />
                    </IconButton>
                </>
            ),
            sortable: false
        }
    ];

    const [managers, setManagers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalRows: 0,
        totalPages: 0,
    });

    const handlePageChange = (newPage) => {
        console.log("NewPage", newPage)
        getManagers(newPage, pagination.pageSize);
    };

    useEffect(() => {
        getManagers(pagination.currentPage, pagination.pageSize);
    }, []);

    const getManagers = async (currentPage, pageSize) => {
        try {
            const result = await getAllManager(currentPage, pageSize);
            if (result && result.pagination && result.data) {
                const { pagination, data } = result;
                setPagination(pagination);
                const transformedData = data.map(manager => ({
                    id: manager.Id,
                    name: manager.Name,
                    role: manager.Role,
                }));
                setManagers(transformedData);
            }
        } catch (error) {
            console.error('Error fetching managers:', error);
        }
    };

    return (
        <MainCard title="Danh sách Manager" contentSX={{ p: 2 }}>
            <CardContent>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item xs={12} sm={6}>
                        {/* Ô tìm kiếm */}
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
                            sx={{ width: '100%' }}
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
                        // onClick={toggleDrawer(true)}
                        >
                            <AddIcon />
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
            <Container>
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={managers}
                        columns={columns}
                        pageSize={pagination.pageSize}
                        rowCount={pagination.totalRows}
                        pagination
                        page={pagination.currentPage}
                        onPageChange={handlePageChange}
                    />
                </Box>
            </Container>
        </MainCard>
    );
}

export default List;
