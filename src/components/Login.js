// src/Login.jsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

import Layout from '../Layout';

const supabaseUrl = 'https://qwhxtyfsbwiwcyemzsub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ログイン・ユーザー登録を行う
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        console.log(email+","+password);
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
      }
      navigate("/WeightFluctuation");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
    <Layout />
    <div style={{ textAlign: "center" }}>
      <div>
        <h1>ログイン</h1>
      </div>
      <div>
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <span onClick={() => setIsLogin(!isLogin)}>
              {`${isLogin ? "登録" : "ログイン"}モードへ切り替える`}
            </span>
          </div>
          <div>
            <button type="submit">{isLogin ? "ログイン" : "登録"}</button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default Login;
