import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { NFTStorage, File } from 'nft.storage';
import LitJsSdk from 'lit-js-sdk';

import { NFT_STORAGE_APIKEY } from '../../config';
import { blobToDataURI } from '../../helpers/convertMethods';

const client = new NFTStorage({ token: NFT_STORAGE_APIKEY });

function SendMail({ tablelandMethods, tableName, mailCount }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(false);
  const [text, setText] = useState(false);
  const [loading, setLoading] = useState(false); 

  const sendMail = async () => {
    try{
      setLoading(true);
      console.log(to, subject, text);
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
            value: to
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
      const writeRes = await tablelandMethods.write(`INSERT INTO ${tableName} (id, body, recipient) VALUES ('${mailCount + 1}', '${cid}', '${to}');`);
      console.log(writeRes);
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
        ? <Button variant="contained" color="primary" size="large" onClick={sendMail}>
            Send Mail
          </Button>
        : <p>Loading...</p>
      }
    </div>
  )
}

export default SendMail;