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
  console.log(domainData, walletAddress)

  return (
    <AppBar
      className="primary-bg-color-300"
      position="fixed"
      color="transparent"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
    >
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="p" noWrap component="div">
          {domainData.sub.length || walletAddress}
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <Button variant="contained" color="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;