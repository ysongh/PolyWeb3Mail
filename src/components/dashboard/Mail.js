import React, { useEffect, useState } from 'react';
import { resultsToObjects } from "@tableland/sdk";

function Mail({ tablelandMethods, tableName }) {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    loadMails();
  }, [])

  const loadMails = async () => {
    const readRes = await tablelandMethods.read(`SELECT * FROM ${tableName};`);
    console.log(readRes);

    const entries = resultsToObjects(readRes);
    let temp = [];

    for (const { name, id } of entries) {
      console.log(`${name}: ${id}`);
      temp.push({ id, name});
    }

    setMails(temp);
  }

  return (
    <div>
      {mails.map(m => (
        <p key={m.id}>{m.name}</p>
      ))}
    </div>
  )
}

export default Mail;