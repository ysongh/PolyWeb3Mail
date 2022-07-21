import React from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MailDetail({ currentMail, setCurrentSection }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between"}}>
        <IconButton size="large" color="primary" onClick={() => setCurrentSection("All Mail")}>
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <p>{currentMail.recipient}</p>
      </div>
      <h1 style={{ marginTop: "0"}}>{currentMail.data.subject}</h1>
      <p>{currentMail.data.text}</p>
    </div>
  )
}

export default MailDetail;