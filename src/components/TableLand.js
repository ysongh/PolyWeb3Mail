import React, { useState } from 'react';

// Import `connect` from the Tableland library
import { connect, resultsToObjects } from "@tableland/sdk";

function TableLand() {
  const [tablelandMethods, setTablelandMethods] = useState("");
  const [tableName, setTableName] = useState("");
  const [text, setText] = useState("");
  const [content, setContent] = useState([]);

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

  return (
    <div>
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
      {content.map(c => (
        <p key={c.id}>{c.name}</p>
      ))}
    </div>
  )
}

export default TableLand;