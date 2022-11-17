import React, { useEffect, useState } from 'react';
import { Paper, TextField, Button } from '@mui/material';

function Setting({ tablelandMethods, tableName, walletAddress, pw3eContract, openSnackbar }) {
  const [addressList, setAddressList] = useState([]);
  const [toAddress, setToAddress] = useState("");

  useEffect(() => {
    loadAddresses();
  }, [])

  const loadAddresses = async () => {
    const addresses = await pw3eContract.getAllAddressesCanSend(walletAddress);
    console.log(addresses);
    setAddressList(addresses);
  }

  const grantWriteAccesssTable = async () => {
    const res = await tablelandMethods.write(`GRANT INSERT ON ${tableName} TO '${toAddress}'`);
    console.log(res);

    const transaction = await pw3eContract.addAddressToSend(toAddress);
    const tx = await transaction.wait();
    console.log(tx);

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
      <h2>Grant Permission to Email</h2>
      {addressList.map((a, i) => (
        <p key={i}>- {a}</p>
      ))}
      
    </Paper>
  )
}

export default Setting;