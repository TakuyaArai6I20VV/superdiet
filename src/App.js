// src/Home.tsx
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/Home");
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

  return (
    <>
      <button onClick={handleHome}>ホーム</button>
      <button onClick={handleWeight}>体重変動</button>
      <button onClick={handleMeal}>食事管理</button>
      <button onClick={handleExercise}>運動入力</button>
      <button onClick={handleSetting}>設定画面</button>
    </>
  );
};
export default Home;
