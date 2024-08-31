import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qwhxtyfsbwiwcyemzsub.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE";
const supabase = createClient(supabaseUrl, supabaseKey);

const Modal = ({ showFlag, setShowModal, onSuccess }) => {
  const [suger, setSuger] = useState("");
  const [fat, setFat] = useState("");
  const [protein, setProtein] = useState("");
  const [calorie, setCalorie] = useState("");

  const closeModal = () => {
    setShowModal(false);
  };

  const onSugerChange = (e) => {
    setSuger(e.target.value);
  };

  const onFatChange = (e) => {
    setFat(e.target.value);
  };

  const onProteinChange = (e) => {
    setProtein(e.target.value);
  };

  const onCalorieChange = (e) => {
    setCalorie(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // デフォルト値を 0 に設定
    const sugerValue = suger === "" ? 0 : Number(suger);
    const fatValue = fat === "" ? 0 : Number(fat);
    const proteinValue = protein === "" ? 0 : Number(protein);
    const calorieValue = calorie === "" ? 0 : Number(calorie);

    const { data, error } = await supabase
      .from("meal")
      .insert([
        {
          suger: sugerValue,
          fat: fatValue,
          protein: proteinValue,
          calorie: calorieValue,
        },
      ])
      .select();

    if (error) {
      console.error("データの挿入に失敗しました:", error);
    } else {
      console.log("データが挿入されました:", data);
      onSuccess(); // データが正常に挿入された後に `fetchTotals` を呼び出す
      closeModal();
    }
  };

  return (
    <>
      {showFlag && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-3/5 max-w-4xl relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✖️
            </button>
            <h1 className="text-xl font-bold mb-4 text-center">栄養情報</h1>
            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <label className="block">
                  糖質(g):
                  <input
                    type="number"
                    min="0"
                    value={suger}
                    onChange={onSugerChange}
                    className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="block">
                  脂質(g):
                  <input
                    type="number"
                    min="0"
                    value={fat}
                    onChange={onFatChange}
                    className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="block">
                  タンパク質(g):
                  <input
                    type="number"
                    min="0"
                    value={protein}
                    onChange={onProteinChange}
                    className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="block">
                  カロリー(kcal):
                  <input
                    type="number"
                    min="0"
                    value={calorie}
                    onChange={onCalorieChange}
                    className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  送信
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
