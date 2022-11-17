import React, { useState } from 'react';
import { Box, Snackbar, Button, IconButton, CssBaseline, Toolbar } from '@mui/material';

import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import Mail from '../components/dashboard/Mail';
import Send from '../components/dashboard/Send';
import MailDetail from '../components/dashboard/MailDetail';
import MySendMail from '../components/dashboard/MySendMail';
import Setting from '../components/dashboard/Setting';

import CloseIcon from '@mui/icons-material/Close';

function Dashboard({ tablelandMethods, tableName, walletAddress, pw3eContract, domainData, setDomainData }) {
  const [currentSection, setCurrentSection] = useState("All Mail");
  const [mailCount, setMailCount] = useState(0);
  const [currentMail, setCurrentMail] = useState({});
  const [open, setOpen] = useState(false);

  const openSnackbar= () => {
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar
        tableName={tableName}
        walletAddress={walletAddress}
        domainData={domainData}
        setDomainData={setDomainData} />
      <Sidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <Box
        className="primary-bg-color-200"
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        style={{ height: "100vh"}}
      >
        <Toolbar />
        {currentSection === "All Mail"
          && <Mail
            tablelandMethods={tablelandMethods}
            tableName={tableName}
            setMailCount={setMailCount}
            walletAddress={walletAddress}
            setCurrentSection={setCurrentSection}
            setCurrentMail={setCurrentMail} /> }
        {currentSection === "Message"
          && <p>Message</p> }
        {currentSection === "Send"
          && <Send
            tablelandMethods={tablelandMethods}
            tableName={tableName}
            mailCount={mailCount}
            pw3eContract={pw3eContract}
            walletAddress={walletAddress}
            domainData={domainData}
            openSnackbar={openSnackbar} /> }
        {currentSection === "Mail Detail"
          && <MailDetail
            currentMail={currentMail}
            tableName={tableName}
            tablelandMethods={tablelandMethods}
            openSnackbar={openSnackbar}
            setCurrentSection={setCurrentSection} /> }
        {currentSection === "My Send Mail"
          && <MySendMail
            tablelandMethods={tablelandMethods}
            tableName={tableName} /> }
        {currentSection === "Setting"
          && <Setting
            tablelandMethods={tablelandMethods}
            tableName={tableName}
            walletAddress={walletAddress}
            pw3eContract={pw3eContract}
            openSnackbar={openSnackbar} /> }
      </Box>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
        autoHideDuration={2000}
        onClose={closeSnackbar}
        message="Success"
        severity="success"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={closeSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  )
}

export default Dashboard;