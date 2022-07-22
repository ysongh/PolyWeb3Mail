import React from 'react';
import { useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import UAuth from '@uauth/js';

import { UNSTOPPABLEDOMAINS_CLIENTID, UNSTOPPABLEDOMAINS_REDIRECT_URI } from '../../config';

const drawerWidth = 200;

const uauth = new UAuth({
  clientID: UNSTOPPABLEDOMAINS_CLIENTID,
  redirectUri: UNSTOPPABLEDOMAINS_REDIRECT_URI,
});

function Navbar({ tableName, walletAddress, domainData, setDomainData }) {
  const navigate = useNavigate();

  const logout = async () => {
    if(domainData){
      setDomainData(null);
      await uauth.logout();
    }
    
    navigate('/');
  }

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
          <p style={{ marginRight: '.7rem' }}>{domainData?.sub || walletAddress}</p>
          <Button variant="contained" color="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;