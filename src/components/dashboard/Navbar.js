import React from 'react';
import { useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Chip, Button } from '@mui/material';
import UAuth from '@uauth/js';

import { UNSTOPPABLEDOMAINS_CLIENTID, UNSTOPPABLEDOMAINS_REDIRECT_URI } from '../../config';
import { formatAddress } from "../../helpers/formatMethods";

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
        <Chip
          className='primary-bg-color-100'
          label={formatAddress(domainData?.sub.length > 0 ? domainData?.sub : walletAddress)} />
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <Button variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;