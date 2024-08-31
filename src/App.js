// src/Home.tsx
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";

import { Drawer, AppBar, Toolbar, List, ListItem, ListItemText, CssBaseline, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { Link } from 'react-router-dom';

const drawerWidth = 240;

// Set up your Supabase client
const supabaseUrl = 'https://qwhxtyfsbwiwcyemzsub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE';
const supabase = createClient(supabaseUrl, supabaseKey);

const Home = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/Home");
  };
  const handleLogin = () => {
    navigate("/Login");
  };
  const handleSetting = () => {
    navigate("/Setting");
  };
  const handleWeight = () => {
    navigate("/WeightFluctuation");
  };
  const handleMeal = () => {
    navigate("/MealManage");
  };
  const handleExercise = () => {
    navigate("/Exercise");
  };

  // ログインに利用
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log(JSON.stringify(user, null, 2));
    } catch (error) {
      alert(error.message);
    }
  };

  // サイドバーのUI用
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };


  // sessionを記録するためのコード（いらないかも）
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
  
    fetchSession();
  
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  

  return (
    <>
      <div style={{ display: 'flex' }}>
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
            <ListItem button component={Link} to="/weight-fluctuation">
              <ListItemText primary="体重変動" />
            </ListItem>
            <ListItem button component={Link} to="/meal-manage">
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
        <main style={{ flexGrow: 1, padding: 3 }}>
          <Toolbar />
          <Typography paragraph>
            <button onClick={handleAuth}>ログイン情報</button>
          </Typography>
        </main>
      </div>
    </>
  );
};
export default Home;
