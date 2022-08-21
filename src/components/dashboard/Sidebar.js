import React from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText, ListItemButton, Button } from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AddIcon from '@mui/icons-material/Add';

const drawerLinks = [
  {
    "text": "All Mail",
    "icon": <EmailIcon />
  },
  {
    "text": "My Send Mail",
    "icon": <SendIcon />
  },
  // {
  //   "text": "Message",
  //   "icon": <MessageIcon />
  // },
  {
    "text": "Setting",
    "icon": <SettingsSuggestIcon />
  },
];
const drawerWidth = 200;

function Sidebar({ currentSection, setCurrentSection }) {
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
      <Toolbar className="primary-bg-color-100">
        <img src="./logo.png" alt="logo" style={{ width: '150px' }} />
      </Toolbar>
      <Divider />
      <div className="primary-bg-color-100" style={{ padding: ".7rem" }}>
        <Button variant="contained" color="secondary" size="large" fullWidth startIcon={<AddIcon />} onClick={() => setCurrentSection("Send")}>
          Compose
        </Button>
      </div>
      <Divider />
      <List className="primary-bg-color-100"  style={{ height: "100vh"}}>
        {drawerLinks.map((d, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton className={d.text === currentSection && "primary-bg-color-200"} onClick={() => setCurrentSection(d.text)}>
              <ListItemIcon>
                {d.icon}
              </ListItemIcon>
              <ListItemText primary={d.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar