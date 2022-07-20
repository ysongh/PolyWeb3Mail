import React, { useEffect, useState } from 'react';
import { resultsToObjects } from "@tableland/sdk";
import LitJsSdk from 'lit-js-sdk';

import { dataURItoBlob } from '../../helpers/convertMethods';

function Mail({ tablelandMethods, tableName, setMailCount }) {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    loadMails();
  }, [])

  const loadMails = async () => {
    const readRes = await tablelandMethods.read(`SELECT * FROM ${tableName};`);
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
  }

  const messageToDecrypt = async (cid) => {
    try{
      const chain = 'ethereum';
      const authSig = await LitJsSdk.checkAndSignAuthMessage({chain});
      const accessControlConditions = [
        {
          contractAddress: '',
          standardContractType: '',
          chain: 'ethereum',
          method: 'eth_getBalance',
          parameters: [':userAddress', 'latest'],
          returnValueTest: {
            comparator: '>=',
            value: '0',  // 0 ETH, so anyone can open
          },
        },
      ];

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
    } 
  }

  return (
    <div>
      {mails.map(m => (
        <div key={m.id}>
          <p>{m.recipient}</p>
          <p>{m.data.subject}</p>
          <p>{m.data.text}</p>
        </div>
       
      ))}
    </div>
  )
}

export default Mail;