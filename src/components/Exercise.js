import Layout from '../Layout';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

import { Container, TextField, Button, Typography, Box, List, ListItem } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

// Set up your Supabase client
const supabaseUrl = 'https://qwhxtyfsbwiwcyemzsub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE'; // セキュリティのためにAPIキーは環境変数に格納するのが推奨です。
const supabase = createClient(supabaseUrl, supabaseKey);

const Exercise = () => {
  const [content, setContent] = useState('');
  const [data, setData] = useState([]);
  const [uuid, setUUID] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: contentData, error } = await supabase
        .from('workout')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

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
    const { error } = await supabase.from('workout').insert([{ content: parseFloat(content), user_id: uuid }]);
    
    if (error) {
      console.error('Error adding workout:', error);
    } else {
      setContent(''); // Clear the input after adding
      // Re-fetch data to update the list
      const { data: { user } } = await supabase.auth.getUser();
      const { data: contentData } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      setData(contentData);
    }
  };

  return (
  <>
    <Layout />
    <Container>
      <Typography variant="h4" gutterBottom>
        運動入力
      </Typography>
      <Box mb={2}>
        <TextField
          label="今日の運動を入力"
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
        />
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
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Weight (kg)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((entry) => (
                        <TableRow key={entry.date}>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell align="right">{entry.content} kg</TableCell>
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
  </>
  );
};

export default Exercise;
