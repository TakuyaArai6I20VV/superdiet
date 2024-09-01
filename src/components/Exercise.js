import Layout from '../Layout';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

import { Container, TextField, Button, Typography, Box, List, ListItem } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

// Set up your Supabase client
const supabaseUrl = 'https://qwhxtyfsbwiwcyemzsub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE'; // セキュリティのためにAPIキーは環境変数に格納するのが推奨です。
const supabase = createClient(supabaseUrl, supabaseKey);



const theme = createTheme({
  typography: {
    // fontSize: 19,
    h4: {
      fontSize: 28,
      fontWeight: 700
    },
    h6: {
      fontWeight: 1000,
    }
  }
});

const Exercise = () => {
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');
  const [data, setData] = useState([]);
  const [uuid, setUUID] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: contentData, error } = await supabase
        .from('workout')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(contentData);
        setUUID(user.id);
      }
    };

    fetchData();
  }, []);

  // Add new weight entry
  const addContent = async () => {
    const { error } = await supabase.from('workout').insert([{ content: content, user_id: uuid, time: time }]);
    
    if (error) {
      console.error('Error adding workout:', error);
    } else {
      setContent(''); // Clear the input after adding
      setTime('');
      // Re-fetch data to update the list
      const { data: { user } } = await supabase.auth.getUser();
      const { data: contentData, error } = await supabase
        .from('workout')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      setData(contentData);
    }
  };

  return (
  <>
  <ThemeProvider theme={theme}>
    <Layout />
    <Container>
      <Typography variant="h4" gutterBottom>
        運動入力
      </Typography>
      <Box>
      <Box mb={2}>
        <TextField
          label="今日の運動を入力"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="運動時間"
          variant="outlined"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </Box>
      </Box>
      <Box mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={addContent}
          fullWidth
        >
          運動を追加
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom>
            今日の運動
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box flex={1} mr={2}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>一覧</TableCell>
                            <TableCell align="right">運動時間（分）</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {(data || []).map((entry) => (
                      <TableRow key={entry.time}>
                        <TableCell>{entry.content}</TableCell>
                        <TableCell align="right">{entry.time} 分</TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        <Box flex={2}>
          <Box>
            
          </Box>
        </Box>
      </Box>
    </Container>
    </ThemeProvider>
  </>
  );
};

export default Exercise;
