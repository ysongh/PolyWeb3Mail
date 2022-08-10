import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { NFTStorage, File } from 'nft.storage';
import LitJsSdk from 'lit-js-sdk';

import { POAP_TOKEN, POAP_APIKEY, NFT_STORAGE_APIKEY } from '../../config';
import { blobToDataURI } from '../../helpers/convertMethods';

const client = new NFTStorage({ token: NFT_STORAGE_APIKEY });

function SendPOAP({ tablelandMethods, openSnackbar, walletAddress }) {
  const [eventId, setEventId] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [codes, setCodes] = useState([]);
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkPOAP() {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: POAP_TOKEN,
        'X-API-Key': POAP_APIKEY
      },
      body: JSON.stringify({
        secret_code: secretCode
      })
    };
    
    fetch(`https://api.poap.tech/event/${eventId}/qr-codes`, options)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setCodes(response);
      })
      .catch(err => console.error(err));
  }

  const sendPOAP = async () => {
    try{
      setLoading(true);
      const tables = await fetch(`${tablelandMethods.options.host}/chain/${tablelandMethods.options.chainId}/tables/controller/${to}`).then(
        (r) => r.json()
      )
      console.log(tables[0].name);

      const toCount = await tablelandMethods.read(`SELECT * FROM ${tables[0].name} WHERE isCopy='no';`);
      console.warn(toCount);

      const chain = 'mumbai';
      const authSig = await LitJsSdk.checkAndSignAuthMessage({chain});
      const accessControlConditions = [
        {
          contractAddress: '',
          standardContractType: '',
          chain,
          method: '',
          parameters: [
            ':userAddress',
          ],
          returnValueTest: {
            comparator: '=',
            value: to
          }
        }
      ]
      const subject = `${walletAddress} sent you POAP!`;
      const text = `http://POAP.xyz/claim/${codes[0].qr_hash}`;
      const userData = JSON.stringify({ subject, text });

      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(userData);

      const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain,
      });

      const prepareToUpload = new File(
        [JSON.stringify(
          {
            encryptedSymmetricKey: Array.from(encryptedSymmetricKey),   // Convert Unit8Array to Array
            encryptedString: await blobToDataURI(encryptedString)
          },
          null,
          2
        )], 'metadata.json');

      const cid = await client.storeDirectory([prepareToUpload]);
      console.log(cid);
      const dateNow = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      const writeRes = await tablelandMethods.write(`INSERT INTO ${tables[0].name} (id, body, recipient, dateSent, isCopy) VALUES ('${toCount.rows.length + 100}', '${cid}', '${to}', '${dateNow}', 'no');`);
      console.log(writeRes);
      openSnackbar();
      setLoading(false);
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField variant="standard" label='Event ID'  onChange={(e) => setEventId(e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField variant="standard" label='Secret Code'  onChange={(e) => setSecretCode(e.target.value)} fullWidth />
        </Grid>
      </Grid>
      <br />
      <Button variant="contained" color="secondary"  size="large" onClick={checkPOAP}>
        Check POAP
      </Button>
      <br />
      <br />

      {codes.length && <>
        <h2>{codes.length} POAP Left</h2>

        <TextField variant="standard" label='To'  onChange={(e) => setTo(e.target.value)} fullWidth />
        <br />
        <br />
        {!loading
          ? <Button variant="contained" color="secondary"  size="large" onClick={sendPOAP}>
              Send POAP
            </Button>
          : <p>Loading...</p>
        }
      </>}
    </div>
  )
}

export default SendPOAP;