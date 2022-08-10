import React, { useEffect, useState } from 'react';
import { connect, resultsToObjects } from "@tableland/sdk";   // Import `connect` from the Tableland library
import LitJsSdk from 'lit-js-sdk';
import { NFTStorage, File } from 'nft.storage';

import { NFT_STORAGE_APIKEY } from '../config';
import { blobToDataURI, dataURItoBlob } from '../helpers/convertMethods';

const client = new NFTStorage({ token: NFT_STORAGE_APIKEY })

function TableLand() {
  const [tablelandMethods, setTablelandMethods] = useState("");
  const [tableName, setTableName] = useState("");
  const [text, setText] = useState("");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [writeAddress, setWriteAddress] = useState("");

  useEffect(() => {
    //connectTpLitNetwork();
  }, [])

  const connectTpLitNetwork = async () => {
    setLoading(true);
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    console.log(client);
    window.litNodeClient = client;

    document.addEventListener('lit-ready', function (e) {
      console.log('LIT network is ready')
      setLoading(false) // replace this line with your own code that tells your app the network is ready
    }, false)
  }

  const connectToTableLand = async () => {
    // Connect to the Tableland testnet (defaults to Goerli testnet)
    // @return {Connection} Interface to access the Tableland network and target chain
    const tableland = await connect({ chain: 'polygon-mumbai' })
    console.log(tableland);
    setTablelandMethods(tableland);

    const tables = await tableland.list();
    console.log(tables);
    if(tables.length){
      setTableName(tables[0].name);

      // Perform a read query, requesting all rows from the table
      const readRes = await tableland.read(`SELECT * FROM ${tables[0].name};`);
      console.log(readRes);

      formatData(readRes);
    }
  }

  const createTable = async () => {
    const { name } = await tablelandMethods.create(
      `name text, id int, primary key (id)`, // Table schema definition
      `test` // Optional `prefix` used to define a human-readable string
    );

    // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
    console.log(name);
    setTableName(name);
  }

  const formatData = async (results) => {
    const entries = resultsToObjects(results);

    let temp = [];
    for (const { name, id } of entries) {
      console.log(`${name}: ${id}`);
      //const text = await messageToDecrypt(name);
      temp.push({ id, name: name});
    }

    setContent(temp);
  }

  const readDataFromTable = async () => {
    const readRes = await tablelandMethods.read(`SELECT * FROM ${tableName};`);
    console.log(readRes);
    formatData(readRes);
  }

  const insertDataToTable = async (cid) => {
    console.log(tableName)
    // Insert a row into the table
    // @return {WriteQueryResult} On-chain transaction hash of the write query
    const writeRes = await tablelandMethods.write(`INSERT INTO ${tableName} (id, name) VALUES ('${6}', '${text}');`);
    console.log(writeRes);
  }

  const messageToEncrypt = async () => {
    const chain = 'mumbai';

    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain});

    const accessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'mumbai',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '0',  // 0 ETH, so anyone can open
        },
      },
    ];
    // 1. Encryption
    // <Blob> encryptedString
    // <Uint8Array(32)> symmetricKey 
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);

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
    insertDataToTable(cid);

    // 3. Decrypt it
    // <String> toDecrypt
    const toDecrypt = LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16');
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
      encryptedString,
      symmetricKey
    );

    console.warn("decryptedString:", decryptedString);
  }

  const messageToDecrypt = async (cid) => {
    try{
      const chain = 'mumbai';

      const authSig = await LitJsSdk.checkAndSignAuthMessage({chain});

      const accessControlConditions = [
        {
          contractAddress: '',
          standardContractType: '',
          chain: 'mumbai',
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

      // 3. Decrypt it
      // <String> toDecrypt
      // Convert Array to Unit8Array
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

  const deleteDAataFromTable = async (id) => {
    // If desired, the row can later be removed
    const removeRes = await tablelandMethods.write(`DELETE FROM ${tableName} WHERE id = ${id};`);
    console.log(removeRes)
  }

  const grantWriteAccesssTable = async () => {
    const res = await tablelandMethods.write(`GRANT INSERT ON ${tableName} TO '${writeAddress}'`);
    console.log(res);
  }

  const checkForTableNameByAddress = async () => {
    const res = await fetch(`${tablelandMethods.options.host}/chain/${tablelandMethods.options.chainId}/tables/controller/${tablelandMethods.options.controller}`).then(
      (r) => r.json()
    )
    console.log(res);
  }


  return (
    <div>
      {loading && <p>Loading...</p>}
      <button onClick={connectToTableLand}>
        Connect To TableLand
      </button>
      <button onClick={createTable}>
        Create
      </button>
      <br />
      <input placeholder='' value={tableName} onChange={(e) => setTableName(e.target.value)}/>
      <button onClick={readDataFromTable}>
        Read
      </button>
      <br />
      <input placeholder='text' onChange={(e) => setText(e.target.value)}/>
      <button onClick={insertDataToTable}>
        Add
      </button>
      <button onClick={messageToEncrypt}>
        Encrypt and Add
      </button>
      {content.map(c => (
        <div key={c.id}>
          <p>{c.name}</p>
          <button onClick={() => deleteDAataFromTable(c.id)}>
            Delete
          </button>
        </div>
        
      ))}
      <br />
      <input placeholder='text' onChange={(e) => setWriteAddress(e.target.value)}/>
      <button onClick={grantWriteAccesssTable}>
        Grant Write
      </button>
    </div>
  )
}

export default TableLand;