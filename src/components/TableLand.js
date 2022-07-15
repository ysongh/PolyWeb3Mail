import React, { useEffect, useState } from 'react';

// Import `connect` from the Tableland library
import { connect, resultsToObjects } from "@tableland/sdk";

import LitJsSdk from 'lit-js-sdk';

function TableLand() {
  const [tablelandMethods, setTablelandMethods] = useState("");
  const [tableName, setTableName] = useState("");
  const [text, setText] = useState("");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    connectTpLitNetwork();
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
      temp.push({ id, name});
    }

    setContent(temp);
  }

  const insertDataToTable = async () => {
    console.log(tableName)
    // Insert a row into the table
    // @return {WriteQueryResult} On-chain transaction hash of the write query
    const writeRes = await tablelandMethods.write(`INSERT INTO ${tableName} (id, name) VALUES ('${content.length + 1}', '${text}');`);
    console.log(writeRes);

    const readRes = await tablelandMethods.read(`SELECT * FROM ${tableName};`);
    console.log(readRes);

    formatData(readRes);
  }

  const messageToEncrypt = async () => {
    const chain = 'ethereum';

    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain})

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

  return (
    <div>
      {loading && <p>Loading...</p>}
      <button onClick={connectToTableLand}>
        Connect To TableLand
      </button>
      <button onClick={createTable}>
        Create
      </button>
      <h1>{tableName}</h1>
      <input placeholder='text' onChange={(e) => setText(e.target.value)}/>
      <button onClick={insertDataToTable}>
        Add
      </button>
      <button onClick={messageToEncrypt}>
        Encrypt
      </button>
      {content.map(c => (
        <p key={c.id}>{c.name}</p>
      ))}
    </div>
  )
}

export default TableLand;