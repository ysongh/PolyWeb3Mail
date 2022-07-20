import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, Button } from '@mui/material';
import { connect } from "@tableland/sdk";

function Home({ setTablelandMethods, setTableName }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const connectToTableLand = async () => {
    try{
      setLoading(true);
      const tableland = await connect({ chain: 'optimism-kovan' })
      setTablelandMethods(tableland);

      const tables = await tableland.list();
      console.log(tables);
      if(tables.length){
        setTableName(tables[0].name);
      }
      else {
        const { name } = await tableland.create(
          `body text, recipient text, id int, primary key (id)`, // Table schema definition
          `myEmail` // Optional `prefix` used to define a human-readable string
        );
    
        console.log(name);
        setTableName(name);
      }
      setLoading(false);
      navigate('./dashboard');
    } catch (error) {
      setLoading(false);
      console.error(error);
    } 
  }

  return (
    <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column'}}>
      <Card style={{ marginTop: '10rem'}}>
        <CardContent>
          <h1 style={{ marginBottom: '.3rem' }}>Welcome to PolyWeb3Mail</h1>
          <p style={{ marginBottom: '1rem'}}>A decentralized email and message platform</p>

          {loading
            ? <p>Loading...</p>
            : <Button variant="contained" onClick={connectToTableLand}>
                Connect Wallet
              </Button>
          }
        </CardContent>
      </Card>
    </Container>
  )
}

export default Home;