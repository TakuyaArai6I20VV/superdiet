// import { useNavigate } from "react-router-dom";
// import Modal from "./MealInputModal/Modal";
// import { useState } from "react";

// const MealManage = () => {
//   const navigate = useNavigate();
//   const handleRoot = () => {
//     navigate("/");
//   };

//   const [showModal, setShowModal] = useState(false);

//   const ShowModal = () => {
//     setShowModal(!showModal);
//   }

//   return (
//     <div>
//       <h1 className="bg-blue-50">食事管理</h1>
//       <div className="meal-input" type="button">
//         <button
//           onClick={ShowModal}
//           className="block text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//         >
//           食事入力
//         </button>
//         <Modal showFlag={showModal} setShowModal={setShowModal} />
//       </div>

//       <button onClick={handleRoot}>戻る</button>
//     </div>
//   );
// };

// export default MealManage;

import { useNavigate } from "react-router-dom";
import Modal from "./MealInputModal/Modal";
import { useState } from "react";

const MealManage = () => {
  const navigate = useNavigate();

  // Navigate to root
  const handleRoot = () => {
    navigate("/");
  };

  // State for modal visibility
  const [showModal, setShowModal] = useState(false);

  // Toggle modal visibility
  const ShowModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">食事管理</h1>

      <div className="flex flex-col items-center gap-4">
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

      {showModal && <Modal showFlag={showModal} setShowModal={setShowModal} />}
    </div>
  );
};

export default MealManage;
