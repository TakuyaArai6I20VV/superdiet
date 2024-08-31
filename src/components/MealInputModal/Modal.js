import { useState } from "react";

const Modal = (props) => {
  const [suger, setSuger] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [calorie, setCalorie] = useState(0);

  const closeModal = () => {
    props.setShowModal(false);
  }

  const onSugerChange = (e) => {
    setSuger(e.target.value);
  }

  const onFatChange = (e) => {
    setFat(e.target.value);
  }

  const onProteinChange = (e) => {
    setProtein(e.target.value);
  }

  const onCalorieChange = (e) => {
    setCalorie(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('糖質：', suger);
    console.log('脂質：', fat);
    console.log('タンパク質：', protein);
    console.log('カロリー：', calorie);
  }

  return (
    <>
      {props.showFlag ? (
        <div className="modal ">
          <form onSubmit={onSubmit}>
            <label>
              糖質(g)：
              <input
                type="number"
                min="0"
                value={suger}
                onChange={onSugerChange}
              />
            </label>
            <label>
              脂質(g)：
              <input type="number" min="0" value={fat} onChange={onFatChange} />
            </label>
            <label>
              タンパク質(g)：
              <input
                type="number"
                min="0"
                value={protein}
                onChange={onProteinChange}
              />
            </label>
            <label>
              カロリー(kcal)：
              <input
                type="number"
                min="0"
                value={calorie}
                onChange={onCalorieChange}
              />
            </label>
            <button type="submit">送信</button>
          </form>
          <button onClick={closeModal}>✖️</button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Modal;
