import React from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText, ListItemButton, Button } from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import PanoramaIcon from '@mui/icons-material/Panorama';

const drawerLinks = [
  {
    "text": "All Mail",
    "icon": <EmailIcon />
  },
  {
    "text": "Message",
    "icon": <MessageIcon />
  },
  {
    "text": "Send Mail",
    "icon": <SendIcon />
  },
  {
    "text": "Send NFT",
    "icon": <PanoramaIcon />
  },
];
const drawerWidth = 200;

function Sidebar({ setCurrentSection }) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        {drawerLinks.map((d, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {d.icon}
              </ListItemIcon>
              <ListItemText primary={d.text} onClick={() => setCurrentSection(d.text)}/>
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
      </List>
    </Drawer>
  )
}

export default Sidebar