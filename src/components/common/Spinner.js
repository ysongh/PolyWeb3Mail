import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function Spinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: "center"}}>
      <CircularProgress color="secondary" size="5rem" />
    </Box>
  )
}

export default Spinner;