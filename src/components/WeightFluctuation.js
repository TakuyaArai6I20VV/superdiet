import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Chart.jsの自動インポート

// Set up your Supabase client
const supabaseUrl = 'https://qwhxtyfsbwiwcyemzsub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE';
const supabase = createClient(supabaseUrl, supabaseKey);

const WeightFluctuation = () => {
  const [weight, setWeight] = useState('');
  const [data, setData] = useState([]);
  const [uuid, setUUID] = useState('');

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: weightData, error } = await supabase
        .from('weight')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(weightData);
        setUUID(user.id);
      }
    };


    fetchData();
  }, []);

  // Add new weight entry
  const addWeight = async () => {
    const { error } = await supabase.from('weight').insert([{ weight: parseFloat(weight), user_id: uuid }]);
    
    if (error) {
      console.error('Error adding weight:', error);
    } else {
      setWeight(''); // Clear the input after adding
      // Re-fetch data to update the list
      const { data: { user } } = await supabase.auth.getUser();
      const { data: weightData } = await supabase
        .from('weight')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      setData(weightData);
    }
  };

  // 折れ線グラフ用のデータ
  const chartData = {
    labels: data.map(entry => entry.date), // 横軸：日付
    datasets: [
      {
        label: '体重',
        data: data.map(entry => entry.weight), // 縦軸：体重
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: '日付', // 横軸ラベル
        },
      },
      y: {
        title: {
          display: true,
          text: '体重 (kg)', // 縦軸ラベルと単位
        },
        ticks: {
          callback: function(value) {
            return value + ' kg'; // 縦軸の値に単位を追加
          }
        }
      }
    }
  };

  return (
    <div>
      <h2>体重変動</h2>
      <div>
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight"
        />
        <button onClick={addWeight}>Add Weight</button>
      </div>
      <div>
        <h3>Weight History</h3>
        <ul>
          {data.map((entry) => (
            <li key={entry.date}>
              {entry.date}: {entry.weight} kg
            </li>
          ))}
        </ul>
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <h3>体重履歴</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default WeightFluctuation;
