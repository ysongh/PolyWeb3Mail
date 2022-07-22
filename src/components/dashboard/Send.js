import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import SendMail from './SendMail';
import SendNFT from './SendNFT';

function Send({ tablelandMethods, tableName, mailCount, pw3eContract }) {
  const [currentSection, setCurrentSection] = useState("Send Mail");

  const handleChange = (event, newValue) => {
    setCurrentSection(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentSection} onChange={handleChange}>
          <Tab label="Send Mail" value="Send Mail" />
          <Tab label="Send NFT" value="Send NFT" />
        </Tabs>
      </Box>
      <br />
      {currentSection === "Send Mail"
        && <SendMail
          tablelandMethods={tablelandMethods}
          tableName={tableName}
          mailCount={mailCount}
          pw3eContract={pw3eContract} /> }
      {currentSection === "Send NFT"
        && <SendNFT /> }
    </Box>
  )
}

export default Send;