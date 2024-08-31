import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./MealInputModal/Modal";
import { createClient } from "@supabase/supabase-js";

import Layout from '../Layout';

const supabaseUrl = "https://qwhxtyfsbwiwcyemzsub.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE";
const supabase = createClient(supabaseUrl, supabaseKey);

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

  // Navigate to root
  const handleRoot = () => {
    navigate("/");
  };

  // Toggle modal visibility
  const ShowModal = () => {
    setShowModal(!showModal);
  };

  // Fetch current user ID
  const fetchUserId = useCallback(async () => {
    const { data: session, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error fetching session:", error);
      return;
    }
    setUserId(session?.session?.user?.id || null);
  }, []);

  // Fetch totals for today
  const fetchTotals = useCallback(async () => {
    if (!userId) {
      console.error("userId is required");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Fetch data for today for the given user_id
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

    // Calculate totals
    const totals = data.reduce(
      (acc, item) => {
        acc.suger += item.suger || 0;
        acc.fat += item.fat || 0;
        acc.protein += item.protein || 0;
        acc.calorie += item.calorie || 0;
        return acc;
      },
      { suger: 0, fat: 0, protein: 0, calorie: 0 }
    );

    setTotals(totals);
  }, [userId]);

  // Fetch userId and totals when component mounts
  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    if (userId) {
      fetchTotals();
    }
  }, [fetchTotals, userId]);

  return (
    <>
    <Layout />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">食事管理</h1>

      <div className="flex flex-col items-center gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4">今日の合計</h2>
          <ul className="space-y-2">
            <li className="flex justify-between text-lg">
              糖質:
              <span className="font-medium">{totals.suger} g</span>
            </li>
            <li className="flex justify-between text-lg">
              脂質:
              <span className="font-medium">{totals.fat} g</span>
            </li>
            <li className="flex justify-between text-lg">
              タンパク質:
              <span className="font-medium">{totals.protein} g</span>
            </li>
            <li className="flex justify-between text-lg">
              カロリー:
              <span className="font-medium">{totals.calorie} kcal</span>
            </li>
          </ul>
        </div>

        <button
          onClick={ShowModal}
          className="bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white font-medium rounded-lg text-sm px-6 py-3 shadow-lg transition duration-200"
        >
          食事入力
        </button>
        <button
          onClick={handleRoot}
          className="bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-white font-medium rounded-lg text-sm px-6 py-3 shadow-lg transition duration-200"
        >
          戻る
        </button>
      </div>

      {showModal && (
        <Modal
          showFlag={showModal}
          setShowModal={setShowModal}
          onSuccess={fetchTotals}
        />
      )}
    </div>
    </>
  );
};

export default MealManage;
