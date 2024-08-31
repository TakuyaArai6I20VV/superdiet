import { useNavigate } from "react-router-dom";
import Modal from "./MealInputModal/Modal";
import { useState } from "react";

const MealManage = () => {
  const navigate = useNavigate();
  const handleRoot = () => {
    navigate("/");
  };

  const [showModal, setShowModal] = useState(false);

  const ShowModal = () => {
    setShowModal(!showModal);
  }

  return (
    <div>
      <h1>食事管理</h1>
      <div className="meal-input">
        <button onClick={ShowModal}>食事入力</button>
        <Modal showFlag={showModal} setShowModal={setShowModal} />
      </div>

      <button onClick={handleRoot}>戻る</button>
    </div>
  );
};

export default MealManage;
