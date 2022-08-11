import React, { useEffect, useState } from 'react';
import { Paper, Typography, Checkbox } from '@mui/material';
import { resultsToObjects } from "@tableland/sdk";

import SkeletonPlaceholder from '../common/SkeletonPlaceholder';
import { formatAddress } from "../../helpers/formatMethods";

function MySendMail({ tablelandMethods, tableName }) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMails();
  }, [])

  const loadMails = async () => {
    try{
      setLoading(true);
      const readRes = await tablelandMethods.read(`SELECT * FROM ${tableName} WHERE isCopy='yes';`);
      console.warn(readRes);

      const entries = resultsToObjects(readRes);
      let temp = [];

      for (const { recipient, body, id, dateSent } of entries) {
        console.log(`${body}: ${id}`);
        temp.unshift({ id, data: body, recipient, dateSent});
      }

      setMails(temp);
      setLoading(false);
    } catch(error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div>
      {loading
        ? <SkeletonPlaceholder />
        : mails.length 
          ? mails.map(m => (
              <Paper key={m.id} style={{ display: 'flex', padding: '0 1rem', marginBottom: '1rem', cursor: "pointer" }}>
                <Checkbox />
                <p style={{ color: 'grey', marginRight: '.5rem' }}>{formatAddress(m.recipient)} - </p>
                <p>{m.dateSent}</p>
              </Paper>
          )) :  <Typography variant="h3">No Mail Yet...</Typography>
      }
    </div>
  )
}

export default MySendMail;