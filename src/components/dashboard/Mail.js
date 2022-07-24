import React, { useEffect, useState } from 'react';
import { Paper, Checkbox } from '@mui/material';
import { resultsToObjects } from "@tableland/sdk";
import LitJsSdk from 'lit-js-sdk';

import SkeletonPlaceholder from '../common/SkeletonPlaceholder';
import { dataURItoBlob } from '../../helpers/convertMethods';
import { formatAddress } from "../../helpers/formatMethods";

function Mail({ tablelandMethods, tableName, setMailCount, walletAddress, setCurrentSection, setCurrentMail }) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMails();
  }, [])

  const loadMails = async () => {
    try{
      setLoading(true);
      const readRes = await tablelandMethods.read(`SELECT * FROM ${tableName} WHERE isCopy='no';`);
      console.warn(readRes);

      const entries = resultsToObjects(readRes);
      let temp = [];

      for (const { recipient, body, id } of entries) {
        console.log(`${body}: ${id}`);
        const strData = await messageToDecrypt(body);
        const toObject = await JSON.parse(strData);
        temp.push({ id, data: toObject, recipient});
      }

      setMails(temp);
      setMailCount(temp.length);
      setLoading(false);
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
    
  }

  const messageToDecrypt = async (cid) => {
    console.warn(cid);
    try{
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
            value: walletAddress
          }
        }
      ]

      let data = await fetch(`https://${cid}.ipfs.dweb.link/metadata.json`);
      data = await data.json();
      console.log(data);

      const toDecrypt = LitJsSdk.uint8arrayToString(new Uint8Array(data.encryptedSymmetricKey), 'base16');
      console.log("toDecrypt:", toDecrypt);

      // <Uint8Array(32)> _symmetricKey 
      const _symmetricKey = await window.litNodeClient.getEncryptionKey({
        accessControlConditions,
        toDecrypt,
        chain,
        authSig
      })

      console.warn("_symmetricKey:", _symmetricKey);

      // <String> decryptedString
      const decryptedString = await LitJsSdk.decryptString(
        dataURItoBlob(data.encryptedString),
        _symmetricKey
      );

      console.warn("decryptedString:", decryptedString);
      return decryptedString;
    } catch (error) {
      console.error(error);
      setLoading(false);
    } 
  }

  const selectMail = (data) => {
    setCurrentSection("Mail Detail");
    setCurrentMail(data);
  }

  return (
    <div>
      {loading
        ? <SkeletonPlaceholder />
        : mails.map(m => (
            <Paper key={m.id} style={{ display: 'flex', padding: '0 1rem', marginBottom: '1rem', cursor: "pointer" }} onClick={() => selectMail(m)}>
              <Checkbox />
              <p style={{ color: 'grey', marginRight: '.5rem' }}>{formatAddress(m.recipient)} - </p>
              <p>{m.data.subject}</p>
            </Paper>
      ))}
    </div>
  )
}

export default Mail;