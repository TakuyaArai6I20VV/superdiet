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
      <h1 className="bg-blue-50">食事管理</h1>
      <div className="meal-input" type="button">
        <button
          onClick={ShowModal}
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          食事入力
        </button>
        <Modal showFlag={showModal} setShowModal={setShowModal} />
      </div>

      <button onClick={handleRoot}>戻る</button>
    </div>
  );
};

export default MealManage;
