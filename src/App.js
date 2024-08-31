// src/Home.tsx
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from "react";

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

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log(JSON.stringify(user, null, 2));
    } catch (error) {
      alert(error.message);
    }
  };


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
      <button onClick={handleHome}>ホーム</button>
      <button onClick={handleLogin}>ログイン</button>
      <button onClick={handleWeight}>体重変動</button>
      <button onClick={handleMeal}>食事管理</button>
      <button onClick={handleExercise}>運動入力</button>
      <button onClick={handleSetting}>設定画面</button>
      <button onClick={handleAuth}>ログイン情報</button>
    </>
  );
};
export default Home;
