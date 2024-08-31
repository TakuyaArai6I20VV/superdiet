import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Set up your Supabase client
const supabaseUrl = 'https://qwhxtyfsbwiwcyemzsub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE';
const supabase = createClient(supabaseUrl, supabaseKey);

const WeightFluctuation = () => {
  const [weight, setWeight] = useState('');
  const [data, setData] = useState([]);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: weightData, error } = await supabase
        .from('weight')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(weightData);
      }
    };

    fetchData();
  }, []);

  // Add new weight entry
  const addWeight = async () => {
    const { error } = await supabase.from('weight').insert([{ weight: parseFloat(weight), user_id: null }]);
    
    if (error) {
      console.error('Error adding weight:', error);
    } else {
      setWeight(''); // Clear the input after adding
      // Re-fetch data to update the list
      const { data: weightData } = await supabase
        .from('weight')
        .select('*')
        .order('date', { ascending: false });
      setData(weightData);
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
    </div>
  );
};

export default WeightFluctuation;
