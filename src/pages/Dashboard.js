import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import LitJsSdk from 'lit-js-sdk';

import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import Mail from '../components/dashboard/Mail';
import SendMail from '../components/dashboard/SendMail';

function Dashboard({ tablelandMethods, tableName }) {
  const [currentSection, setCurrentSection] = useState("Mail");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    connectToLitNetwork();
  }, [])

  const connectToLitNetwork = async () => {
    setLoading(true);
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    console.log(client);
    window.litNodeClient = client;

    document.addEventListener('lit-ready', function (e) {
      console.log('LIT network is ready')
      setLoading(false) // replace this line with your own code that tells your app the network is ready
    }, false)
  }

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
        {loading && <p>Loading...</p>}
        {currentSection === "Mail"
          && <Mail
            tablelandMethods={tablelandMethods}
            tableName={tableName} /> }
        {currentSection === "Message"
          && <p>Message</p> }
        {currentSection === "Send Mail"
          && <SendMail
            tablelandMethods={tablelandMethods}
            tableName={tableName} /> }
      </Box>
    </Box>
  )
}

export default Dashboard;