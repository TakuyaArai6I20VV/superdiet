import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./MealInputModal/Modal";
import { createClient } from "@supabase/supabase-js";
import { Container, Typography, Button, Box } from "@mui/material";
import { grey } from "@mui/material/colors";

import Layout from '../Layout';

const supabaseUrl = "https://qwhxtyfsbwiwcyemzsub.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE";
const supabase = createClient(supabaseUrl, supabaseKey);

const primary = grey[400];

const MealManage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [totals, setTotals] = useState({
    suger: 0,
    fat: 0,
    protein: 0,
    calorie: 0,
  });
  const [userId, setUserId] = useState(null);

  const handleRoot = () => {
    navigate("/");
  };

  const onShowModal = () => {
    setShowModal(!showModal);
  };

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

  return (
    <>
      <Layout />
      <Container>
        <div>
          <Typography variant="h4" gutterBottom>
            食事管理
          </Typography>
          <div>
            <Box mb={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={onShowModal}
                fullWidth
              >
                摂取した栄養を入力
              </Button>
            </Box>

            <Box mb={2}>
              <div className="bg-gray-100 shadow-md rounded-lg p-8 w-full">
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
                              (calculatePercentage(value, maxValues[key]) / 100)
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
                              calculatePercentage(value, maxValues[key]) / 100,
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

            <Box mb={2}>
              <Button
                variant="contained"
                onClick={handleRoot}
                fullWidth
                className="bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                ホームに戻る
              </Button>
            </Box>
          </div>

          {showModal && (
            <Modal
              showFlag={showModal}
              setShowModal={setShowModal}
              onSuccess={fetchTotals}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default MealManage;
