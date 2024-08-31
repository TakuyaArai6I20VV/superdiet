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
    setSuger(parseInt(e.target.value, 10) || 0); // 数値として取得
  };

  const onFatChange = (e) => {
    setFat(parseInt(e.target.value, 10) || 0); // 数値として取得
  };

  const onProteinChange = (e) => {
    setProtein(parseInt(e.target.value, 10) || 0); // 数値として取得
  };

  const onCalorieChange = (e) => {
    setCalorie(parseInt(e.target.value, 10) || 0); // 数値として取得
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
      props.onSuccess(); // データが正常に挿入された後に `fetchTotals` を呼び出す
      closeModal(); // モーダルを閉じる
    }
  };

  return (
    <>
      {props.showFlag && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4 sm:mx-0">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✖️
            </button>
            <h1 className="text-xl font-bold mb-4 text-center">栄養入力</h1>
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
