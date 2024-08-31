// src/Layout.js
import React, { useState } from 'react';
import { Drawer, AppBar, Toolbar, List, ListItem, ListItemText, CssBaseline, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Be your Supaman
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/home">
            <ListItemText primary="ホーム" />
          </ListItem>
          <ListItem button component={Link} to="/login">
            <ListItemText primary="ログイン" />
          </ListItem>
          <ListItem button component={Link} to="/weightfluctuation">
            <ListItemText primary="体重変動" />
          </ListItem>
          <ListItem button component={Link} to="/mealmanage">
            <ListItemText primary="食事管理" />
          </ListItem>
          <ListItem button component={Link} to="/exercise">
            <ListItemText primary="運動入力" />
          </ListItem>
          <ListItem button component={Link} to="/setting">
            <ListItemText primary="設定画面" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
