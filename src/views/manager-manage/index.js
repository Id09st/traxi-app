import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ManagerTable from 'views/manager-manage/ManagerTable';
import ManagerList from 'views/manager-manage/ManagerList';

export default function ManagerManage() {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <ManagerTable />
      </Paper>
    </Box>
  );
}
