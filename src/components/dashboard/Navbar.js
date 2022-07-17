import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const drawerWidth = 200;

function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h6" noWrap component="div">
          PolyWeb3Mail
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <p style={{ marginRight: '.7rem' }}>Test</p>
          <Button variant="contained" color="secondary">
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;