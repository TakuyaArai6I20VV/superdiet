import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qwhxtyfsbwiwcyemzsub.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE";
const supabase = createClient(supabaseUrl, supabaseKey);

const Modal = (props) => {
  const [suger, setSuger] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [calorie, setCalorie] = useState(0);

  const closeModal = () => {
    props.setShowModal(false);
  };

  const onSugerChange = (e) => {
    setSuger(parseInt(e.target.value, 10) || 0);
  };

  const onFatChange = (e) => {
    setFat(parseInt(e.target.value, 10) || 0);
  };

  const onProteinChange = (e) => {
    setProtein(parseInt(e.target.value, 10) || 0);
  };

  const onCalorieChange = (e) => {
    setCalorie(parseInt(e.target.value, 10) || 0);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("糖質：", suger);
    console.log("脂質：", fat);
    console.log("タンパク質：", protein);
    console.log("カロリー：", calorie);

    const { data, error } = await supabase
      .from("meal")
      .insert([{ suger: suger, fat: fat, protein: protein, calorie: calorie }])
      .select();

    if (error) {
      console.error("データの挿入に失敗しました:", error);
    } else {
      console.log("データが挿入されました:", data);
      closeModal();
    }
  };

  return (
    <>
      {props.showFlag && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-96">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-full"
              aria-label="Close"
            >
              ✖️
            </button>
            <h1 className="text-2xl font-bold mb-6 text-center">栄養入力</h1>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  糖質(g)：
                  <input
                    type="number"
                    min="0"
                    value={suger}
                    onChange={onSugerChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  脂質(g)：
                  <input
                    type="number"
                    min="0"
                    value={fat}
                    onChange={onFatChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  タンパク質(g)：
                  <input
                    type="number"
                    min="0"
                    value={protein}
                    onChange={onProteinChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  カロリー(kcal)：
                  <input
                    type="number"
                    min="0"
                    value={calorie}
                    onChange={onCalorieChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                送信
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
