import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';

import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';

function Dashboard() {
  const [currentSection, setCurrentSection] = useState("Mail");

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar setCurrentSection={setCurrentSection} />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {currentSection === "Mail"
          && <p>Mail</p> }
        {currentSection === "Message"
          && <p>Message</p> }
      </Box>
    </Box>
  )
}

export default Dashboard;