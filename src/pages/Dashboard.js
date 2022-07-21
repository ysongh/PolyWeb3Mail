import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import LitJsSdk from 'lit-js-sdk';

import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import Mail from '../components/dashboard/Mail';
import Send from '../components/dashboard/Send';
import MailDetail from '../components/dashboard/MailDetail';
import MySendMail from '../components/dashboard/MySendMail';

function Dashboard({ tablelandMethods, tableName, walletAddress, pw3eContract }) {
  const [currentSection, setCurrentSection] = useState("All Mail");
  const [mailCount, setMailCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentMail, setCurrentMail] = useState({});

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
      <Navbar tableName={tableName} walletAddress={walletAddress} />
      <Sidebar setCurrentSection={setCurrentSection} />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {loading && <p>Loading...</p>}
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
            walletAddress={walletAddress} /> }
        {currentSection === "Mail Detail"
          && <MailDetail
            currentMail={currentMail}
            setCurrentSection={setCurrentSection} /> }
        {currentSection === "My Send Mail"
          && <MySendMail
            tablelandMethods={tablelandMethods}
            tableName={tableName} /> }
      </Box>
    </Box>
  )
}

export default Dashboard;