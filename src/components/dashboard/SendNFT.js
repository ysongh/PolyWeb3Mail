import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from "axios";

import { NFTPORT_API } from '../../config';

function SendNFT() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState(false);
  const [text, setText] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionUrl, setTransactionUrl] = useState('');

  async function sendNFT({  }) {
    try{
      setLoading(true);
      const options = {
        method: 'POST',
        url: 'https://api.nftport.xyz/v0/mints/easy/urls',
        headers: {
          'Content-Type': 'application/json',
          Authorization: NFTPORT_API
        },
        data: {
          chain: 'polygon',
          name: subject,
          description: text,
          file_url: imageURL,
          mint_to_address: to
        }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
        setTransactionUrl(response.data.transaction_external_url);
        setLoading(false);
      }).catch(function (error) {
        console.error(error);
        setLoading(false);
      });

    } catch(error) {
       console.error(error)
       setLoading(false);
    }  
  }

  return (
    <div>
      <TextField variant="standard" placeholder='To'  onChange={(e) => setTo(e.target.value)} fullWidth />
      <TextField variant="standard" placeholder='Subject'  onChange={(e) => setSubject(e.target.value)} fullWidth />
      <TextField variant="standard" placeholder='Image URL'  onChange={(e) => setImageURL(e.target.value)} fullWidth />
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
        ? <Button variant="contained" color="primary" size="large" onClick={sendNFT}>
            Send NFT
          </Button>
        : <p>Loading...</p>
      }
      {transactionUrl &&
        <p style={{ fontSize: '1.4rem'}}>
          Success, see transaction {" "}
          <a href={transactionUrl} target="_blank" rel="noopener noreferrer">
              {transactionUrl}
          </a>
        </p>
      }
    </div>
  )
}

export default SendNFT;