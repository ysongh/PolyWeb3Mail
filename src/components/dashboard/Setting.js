import React, { useState } from 'react';
import { Paper, TextField, Button } from '@mui/material';

function Setting({ tablelandMethods, tableName, openSnackbar }) {
  const [toAddress, setToAddress] = useState("");

  const grantWriteAccesssTable = async () => {
    const res = await tablelandMethods.write(`GRANT INSERT ON ${tableName} TO '${toAddress}'`);
    console.log(res);
    openSnackbar();
  }

  return (
    <Paper style={{ padding: "1rem" }}>
      <h1>Setting</h1>
      <h3 style={{ marginBottom: '0'}}>Allow an address to send email to you</h3>
      <TextField variant="outlined" placeholder='Address'  onChange={(e) => setToAddress(e.target.value)} fullWidth />
      <br />
      <br />
      <Button variant="contained" color="secondary" size="large" onClick={grantWriteAccesssTable}>
        Save
      </Button>
    </Paper>
  )
}

export default Setting;