import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function SendMail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(false);
  const [text, setText] = useState(false);

  const sendMail = () => {
    console.log(to, subject, text);
  }

  return (
    <div>
      <TextField variant="standard" placeholder='To'  onChange={(e) => setTo(e.target.value)} fullWidth />
      <TextField variant="standard" placeholder='Subject'  onChange={(e) => setSubject(e.target.value)} fullWidth />
      <TextField
          multiline
          rows={10}
          fullWidth
          placeholder='Detail'
          variant="standard"
          onChange={(e) => setText(e.target.value)}
        />
      <br />
      <br />
      <Button variant="contained" color="primary" size="large" onClick={sendMail}>
        Send
      </Button>
    </div>
  )
}

export default SendMail;