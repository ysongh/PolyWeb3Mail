import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, Button } from '@mui/material';
import { connect } from "@tableland/sdk";
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import LitJsSdk from 'lit-js-sdk';

import PolyWeb3Mail from '../artifacts/contracts/PolyWeb3Mail.sol/PolyWeb3Mail.json';

const POLYWEB3MAIL_ADDRESS = "0xE5e63Dc57561A8eB0C7AeB4F96331f311E8C3FA7";

function Home({ setTablelandMethods, setTableName, setWalletAddress, setpw3eContract }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);  
    console.log(provider);

    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);

    let contract = new ethers.Contract(POLYWEB3MAIL_ADDRESS, PolyWeb3Mail.abi, signer);
    setpw3eContract(contract);

    connectToTableLand(contract);
  }

  const connectToTableLand = async (contract) => {
    try{
      setLoading(true);
      const tableland = await connect({ chain: 'polygon-mumbai' });
      setTablelandMethods(tableland);

      const tables = await tableland.list();
      console.log(tables);
      if(tables.length){
        setTableName(tables[0].name);
      }
      else {
        const { name } = await tableland.create(
          `body text, recipient text, dateSent text, isCopy text, id int, primary key (id)`, // Table schema definition
          `myEmail` // Optional `prefix` used to define a human-readable string
        );
    
        console.log(name);
        setTableName(name);
        const transaction = await contract.setTablename(name);
        const tx = await transaction.wait();
        console.log(tx);
      }
      await connectToLitNetwork();
      setLoading(false);
      navigate('./dashboard');
    } catch (error) {
      setLoading(false);
      console.error(error);
    } 
  }

  const connectToLitNetwork = async () => {
    const client = new LitJsSdk.LitNodeClient();
    await client.connect();
    console.log(client);
    window.litNodeClient = client;

    document.addEventListener('lit-ready', function (e) {
      console.log('LIT network is ready')
      setLoading(false) // replace this line with your own code that tells your app the network is ready
    }, false)
  }

  return (
    <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column'}}>
      <Card style={{ marginTop: '10rem'}}>
        <CardContent>
          <h1 style={{ marginBottom: '.3rem' }}>Welcome to PolyWeb3Mail</h1>
          <p style={{ marginBottom: '1rem'}}>A decentralized email and message platform</p>

          {loading
            ? <p>Loading...</p>
            : <Button variant="contained" onClick={connectWallet}>
                Connect Wallet
              </Button>
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default Home;