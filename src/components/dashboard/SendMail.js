import React, { useState } from 'react';
import { TextField, Button, LinearProgress } from '@mui/material';
import { NFTStorage, File } from 'nft.storage';
import LitJsSdk from 'lit-js-sdk';
import { ethers } from 'ethers';

import { NFT_STORAGE_APIKEY } from '../../config';
import { blobToDataURI } from '../../helpers/convertMethods';
import { resolveUnstoppableDomainNamesIntoRecords } from "../../helpers/unstoppableDomainMethods";

const client = new NFTStorage({ token: NFT_STORAGE_APIKEY });

function SendMail({ tablelandMethods, tableName, mailCount, openSnackbar }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(false);
  const [text, setText] = useState(false);
  const [loading, setLoading] = useState(false); 

  const sendMail = async () => {
    try{
      setLoading(true);
      let toAddress = to;
      if(toAddress.includes(".")) {
        const UDdata = await resolveUnstoppableDomainNamesIntoRecords(to);
        if(UDdata.meta.owner){
          toAddress = ethers.utils.getAddress(UDdata.meta.owner);
        }
      }
      
      const tables = await fetch(`${tablelandMethods.options.host}/chain/${tablelandMethods.options.chainId}/tables/controller/${toAddress}`).then(
        (r) => r.json()
      )
      console.log(tables[0].name);

      const toCount = await tablelandMethods.read(`SELECT * FROM ${tables[0].name} WHERE isCopy='no';`);
      console.warn(toCount);

      const seflCount = await tablelandMethods.read(`SELECT * FROM ${tableName} WHERE isCopy='yes';`);
      console.warn(seflCount);

      console.warn(to, subject, text, toAddress);
      const chain = 'ethereum';
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
            value: toAddress
          }
        }
      ]
      const userData = JSON.stringify({ subject, text });

      // 1. Encryption
      // <Blob> encryptedString
      // <Uint8Array(32)> symmetricKey 
      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(userData);

      console.warn("symmetricKey:", symmetricKey);
      
      // 2. Saving the Encrypted Content to the Lit Nodes
      // <Unit8Array> encryptedSymmetricKey
      const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSig,
        chain,
      });
      
      console.warn("encryptedSymmetricKey:", encryptedSymmetricKey);
      console.warn("encryptedString:", encryptedString);

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
      const writeRes = await tablelandMethods.write(`INSERT INTO ${tables[0].name} (id, body, recipient, dateSent, isCopy) VALUES ('${toCount.rows.length + 1}', '${cid}', '${toAddress}', '${dateNow}', 'no');`);
      await tablelandMethods.write(`INSERT INTO ${tableName} (id, body, recipient, dateSent, isCopy) VALUES ('${seflCount.rows.length + 1}', '${cid}', '${toAddress}', '${dateNow}', 'yes');`);
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
      {!loading
        ? <Button variant="contained" color="secondary" size="large" onClick={sendMail}>
            Send Mail
          </Button>
        : <LinearProgress color="secondary" />
      }
    </div>
  )
}

export default SendMail;