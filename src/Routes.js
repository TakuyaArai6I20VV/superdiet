// src/Routes.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./App";
import Login from "./components/Login";
import Setting from "./components/Setting";
import MealManage from "./components/MealManage";
import Exercise from "./components/Exercise";
import WeightFluctuation from "./components/WeightFluctuation";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/weightfluctuation" element={<WeightFluctuation />} />
      <Route path="/MealManage" element={<MealManage />} />
      <Route path="/Exercise" element={<Exercise />} />
      <Route path="/setting" element={<Setting />} />
    </Routes>
  );
};
