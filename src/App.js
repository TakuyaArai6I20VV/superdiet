// src/Home.tsx
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './Layout';
import { AppRoutes } from './Routes';
import axios from "axios";

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProfileImage } from "./components/ProfileImage";
const drawerWidth = 240;

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
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 食事管理画面
  const [totals, setTotals] = useState({
    suger: 0,
    fat: 0,
    protein: 0,
    calorie: 0,
  });
  const [userId, setUserId] = useState(null);

  // Fetch user ID from Supabase
  const fetchUserId = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Error fetching session:", error);
      return;
    }
    const id = session?.user?.id || null;
    setUserId(id);
  };

  const fetchTotals = useCallback(async () => {
    if (!userId) {
      console.error("userId is required");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    const { data, error } = await supabase
      .from("meal")
      .select("suger, fat, protein, calorie")
      .eq("user_id", userId)
      .gte("created_at", today + "T00:00:00Z")
      .lt("created_at", today + "T23:59:59Z");

    if (error) {
      console.error("データの取得に失敗しました:", error);
      return;
    }

    const totals = data.reduce(
      (acc, item) => {
        acc.suger += item.suger;
        acc.fat += item.fat;
        acc.protein += item.protein;
        acc.calorie += item.calorie;
        return acc;
      },
      { suger: 0, fat: 0, protein: 0, calorie: 0 }
    );

    setTotals(totals);
  }, [userId]);

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTotals();
    }
  }, [userId, fetchTotals]);

  const maxValues = {
    suger: 380,
    fat: 75,
    protein: 65,
    calorie: 2650,
  };

  const calculatePercentage = (value, max) => {
    return ((value / max) * 100).toFixed(1);
  };

  // 体重変動
  const [weight, setWeight] = useState("");
  const [data, setData] = useState([]);
  const [uuid, setUUID] = useState("");

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: weightData, error } = await supabase
        .from("weight")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(weightData);
        setUUID(user.id);
      }
    };

    fetchData();
  }, []);

  // Add new weight entry
  const addWeight = async () => {
    const { error } = await supabase
      .from("weight")
      .insert([{ weight: parseFloat(weight), user_id: uuid }]);

    if (error) {
      console.error("Error adding weight:", error);
    } else {
      setWeight(""); // Clear the input after adding
      // Re-fetch data to update the list
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: weightData } = await supabase
        .from("weight")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      setData(weightData);
    }
  };

  // 折れ線グラフ用のデータ
  const chartData = {
    labels: data.map((entry) => entry.date), // 横軸：日付
    datasets: [
      {
        label: "体重",
        data: data.map((entry) => entry.weight), // 縦軸：体重
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false, // ラベルを表示しない
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "日付", // 横軸ラベル
        },
      },
      y: {
        title: {
          display: true,
          text: "体重 (kg)", // 縦軸ラベルと単位
        },
        ticks: {
          callback: function (value) {
            return value + " kg"; // 縦軸の値に単位を追加
          },
        },
      },
    },
  };

  // 運動
  const [content, setContent] = useState("");
  const [time, setTime] = useState("");
  // const [data, setData] = useState([]);
  // const [uuid, setUUID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: contentData, error } = await supabase
        .from("workout")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(contentData);
        setUUID(user.id);
      }
    };

    fetchData();
  }, []);

  // Add new weight entry
  const addContent = async () => {
    const { error } = await supabase
      .from("workout")
      .insert([{ content: content, user_id: uuid, time: time }]);

    if (error) {
      console.error("Error adding workout:", error);
    } else {
      setContent(""); // Clear the input after adding
      setTime("");
      // Re-fetch data to update the list
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: contentData, error } = await supabase
        .from("workout")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      setData(contentData);
    }
  };

  // イメージ
  const [image, setImage] = useState(null); // 初期値をnullに設定
  const [generatedImage, setGeneratedImage] = useState(null); // 生成された画像用のステート
  // コンポーネントの初期レンダリング時にLocalStorageから画像を取得
  useEffect(() => {
    const savedImage = localStorage.getItem("generatedImage");
    if (savedImage) {
      setGeneratedImage(savedImage);
    }
  }, []);
  // ファイルをBase64形式で読み込む関数
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // 成功時に結果を返す
      reader.onerror = (error) => reject(error); // エラーが発生した場合
      reader.readAsDataURL(file); // ファイルをBase64として読み込む
    });
  };
  const base64ToBlob = (base64, mime) => {
    const byteString = atob(base64.split(",")[1]);
    const mimeString = mime || "image/jpeg";
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // ファイルが選択されたときの処理
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64Image = await readFileAsDataURL(file);
      setImage(base64Image); // 読み込んだ画像を設定
    }
  };

  // 生成ボタンが押されたときの処理
  const handleClick = async () => {
    const formData = new FormData();
    formData.append("prompt", "make the person funny");
    formData.append("output_format", "jpeg");
    formData.append("mode", "image-to-image");
    formData.append("strength", "0.7");
    if (image) {
      const blob = base64ToBlob(image, "image/jpeg"); // Base64をBlobに変換
      formData.append("image", blob, "image.jpg"); // BlobをFormDataに追加
    }

    try {
      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        formData,
        {
          headers: {
            Authorization: "sk-AxdmiKDeWFnUujz93LhEMEEZM0mqu1DU6v4NaQ1L8A7gt0bZ",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const base64GeneratedImage = `data:image/jpeg;base64,${response.data.image}`; // Base64形式でレスポンスを受け取る
        localStorage.setItem("generatedImage", base64GeneratedImage);
        setGeneratedImage(base64GeneratedImage); // 生成された画像を設定
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during image generation:", error);
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Layout />
        <div className="flex flex-col p-4 space-y-6">
          {/* 上部コンテナ：食事管理と画像生成 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 食事管理 */}
            <Container className="flex-1 bg-gray-100 shadow-md rounded-lg p-8">
              <Typography variant="h4" gutterBottom>
                食事管理
              </Typography>
              <Box mb={2} className="flex-1">
                <div className="flex-1 bg-gray-100 shadow-md rounded-lg p-8">
                  <h2 className="text-2xl font-semibold mb-6">今日の合計</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(totals).map(([key, value]) => (
                      <div key={key} className="flex flex-col items-center">
                        <div className="relative w-32 h-32">
                          <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Outer circle (goal) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="gray"
                              strokeWidth="10"
                              fill="none"
                            />
                            {/* Inner circle (progress) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke={
                                key === "calorie"
                                  ? "#F97316"
                                  : key === "suger"
                                  ? "#60A5FA"
                                  : key === "fat"
                                  ? "#F43F5E"
                                  : "#22D3EE"
                              }
                              strokeWidth="10"
                              strokeDasharray={`${
                                2 *
                                Math.PI *
                                45 *
                                (calculatePercentage(value, maxValues[key]) /
                                  100)
                              } ${
                                2 *
                                Math.PI *
                                45 *
                                (1 -
                                  calculatePercentage(value, maxValues[key]) /
                                    100)
                              }`}
                              strokeLinecap="round"
                              fill="none"
                              transform="rotate(-90 50 50)"
                            />
                            {/* Center text */}
                            <text
                              x="50%"
                              y="50%"
                              textAnchor="middle"
                              dy="-0.3em"
                              className="text-lg font-semibold"
                            >
                              {value}
                            </text>
                            <text
                              x="50%"
                              y="55%"
                              textAnchor="middle"
                              className="text-xs"
                            >
                              {key === "calorie" ? "kcal" : "g"}
                            </text>
                          </svg>
                        </div>
                        <span className="mt-2 text-lg font-medium">
                          {key === "suger"
                            ? "糖質"
                            : key === "fat"
                            ? "脂質"
                            : key === "protein"
                            ? "タンパク質"
                            : "カロリー"}
                        </span>
                        <div className="w-32 mt-4 relative">
                          <div
                            className="absolute inset-0 bg-gray-200 rounded-lg"
                            style={{
                              width: "100%",
                              height: "8px",
                              backgroundColor: "#e2e8f0",
                              borderRadius: "4px",
                              border: "2px solid lightgray",
                            }}
                          />
                          <div
                            className="absolute inset-0 rounded-lg"
                            style={{
                              width: "100%",
                              height: "8px",
                              backgroundColor:
                                calculatePercentage(value, maxValues[key]) > 100
                                  ? "red"
                                  : "#60A5FA",
                              borderRadius: "4px",
                              transform: `scaleX(${Math.min(
                                calculatePercentage(value, maxValues[key]) /
                                  100,
                                1
                              )})`,
                              transformOrigin: "left",
                              transition: "background-color 0.3s",
                            }}
                          />
                        </div>
                        <span className="mt-2 text-sm">
                          目安: {maxValues[key]}{" "}
                          {key === "calorie" ? "kcal" : "g"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Box>
            </Container>

            {/* 画像生成 */}
            <Container className="flex-1 bg-gray-100 shadow-md rounded-lg p-8">
              <Typography variant="h4" gutterBottom>
                画像生成
              </Typography>
              <Box className="h-[calc(100%-2rem)] flex flex-col">
                <input onChange={handleChange} type="file" className="mb-4" />
                <button
                  onClick={handleClick}
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  生成！
                </button>
                <div className="flex-1 overflow-auto">
                  {/*
                  {image && (
                    <img
                      src={image}
                      alt="Uploaded"
                      className="mb-4 max-w-full h-auto"
                    />
                  )}
                    */}
                  {generatedImage && (
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="max-w-full h-auto"
                    />
                  )}
                </div>
              </Box>
            </Container>
          </div>

          {/* 下部コンテナ：体重変動と運動記録 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 体重変動 */}
            <Container className="flex-1 bg-gray-100 shadow-md rounded-lg p-8">
              <Typography variant="h4" gutterBottom>
                体重変動
              </Typography>
              <Box className="h-[calc(100%-2rem)] flex flex-col">
                <Typography variant="h6" gutterBottom>
                  体重履歴
                </Typography>
                <TableContainer
                  component={Paper}
                  className="mb-4 flex-shrink-0"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <Table stickyHeader>
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
                          <TableCell align="right">{entry.weight} kg</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box className="flex-grow">
                  <Line data={chartData} options={chartOptions} />
                </Box>
              </Box>
            </Container>

            {/* 運動記録 */}
            <Container className="flex-1 bg-gray-100 shadow-md rounded-lg p-8">
              <Typography variant="h4" gutterBottom>
                今日の運動
              </Typography>
              <Box className="h-[calc(100%-2rem)] flex flex-col">
                <TableContainer component={Paper} className="flex-grow">
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
            </Container>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};
export default Home;

{/*
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
            <ListItem button component={Link} to="/weightFluctuation">
              <ListItemText primary="体重変動" />
            </ListItem>
            <ListItem button component={Link} to="/mealManage">
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
    */}
