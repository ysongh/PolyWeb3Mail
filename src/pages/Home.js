import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, Button } from '@mui/material';
import { connect } from "@tableland/sdk";

function Home({ setTablelandMethods, setTableName }) {
  const navigate = useNavigate();

  const connectToTableLand = async () => {
    const tableland = await connect({ chain: 'ethereum-goerli' })
    setTablelandMethods(tableland);

    const tables = await tableland.list();
    console.log(tables);
    if(tables.length){
      setTableName(tables[0].name);
    }
    else {
      const { name } = await tableland.create(
        `name text, id int, primary key (id)`, // Table schema definition
        `test` // Optional `prefix` used to define a human-readable string
      );
  
      console.log(name);
      setTableName(name);
    }
    navigate('./dashboard');
  }

  return (
    <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column'}}>
      <Card style={{ marginTop: '10rem'}}>
        <CardContent>
          <h1 style={{ marginBottom: '.3rem' }}>Welcome to PolyWeb3Mail</h1>
          <p style={{ marginBottom: '1rem'}}>A decentralized email and message platform</p>

          <Button variant="contained" onClick={connectToTableLand}>
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Home;