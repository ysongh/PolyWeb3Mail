import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';

import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import Mail from '../components/dashboard/Mail';

function Dashboard({ tablelandMethods, tableName }) {
  const [currentSection, setCurrentSection] = useState("Mail");

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar tableName={tableName} />
      <Sidebar setCurrentSection={setCurrentSection} />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {currentSection === "Mail"
          && <Mail
            tablelandMethods={tablelandMethods}
            tableName={tableName} /> }
        {currentSection === "Message"
          && <p>Message</p> }
      </Box>
    </Box>
  )
}

export default Dashboard;