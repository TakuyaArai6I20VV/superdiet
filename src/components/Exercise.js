import Layout from '../Layout';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

import { Container, TextField, Button, Typography, Box, List, ListItem } from '@mui/material';
import { Avatar,TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Autocomplete } from '@mui/material';

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
    },
    h8: {
      fontSize: '1.5rem',  // Adjust size as needed
      fontWeight: 'bold',
      color: '#333',       // Adjust color as needed
    },
    h9: {
      fontSize: '1.25rem', // Adjust size as needed
      fontWeight: 'normal',
      color: '#666',       // Adjust color as needed
    },
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2196f3', // Adjust color as needed
          width: '200px',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
    },
  },
});

const Exercise = () => {
  const [content, setContent] = useState('');
  const [time, setTime] = useState('');
  const [data, setData] = useState([]);
  const [uuid, setUUID] = useState('');

  var calory = 0;

  const options = [
    'ランニング',
    'ウォーキング',
    '筋トレ',
    'ヨガ',
    'サイクリング',
    'その他',
  ];

  const nums = [10,3,5,2.7,8.5,5];

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

  // calory = 0;
    // カロリー計算
  data.forEach(item => {
    const index = options.indexOf(item.content);
    if (index !== -1) {
      const caloriePerMinute = nums[index];
      calory += caloriePerMinute * parseInt(item.time, 10);
    }
  });
    
    console.log(data);
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
      <Autocomplete
      options={options}
      value={content}
      onChange={(event, newValue) => setContent(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="今日の運動を入力"
          variant="outlined"
        />
      )}
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
        >
          運動を追加
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom>
            今日の運動 （総カロリー：{calory}kcal）
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
        </Box>
      </Box>
    </Container>
    </ThemeProvider>
  </>
  );
};

export default Exercise;
