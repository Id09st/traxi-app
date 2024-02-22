import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import DriverTable from './DriverTable';

export default function DriverManage() {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <DriverTable />
      </Paper>
    </Box>
  );
}
