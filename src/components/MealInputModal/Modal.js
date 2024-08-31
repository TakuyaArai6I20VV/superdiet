const Modal = (props) => {
  const closeModal = () => {
    props.setShowModal(false);
  }

  return (
    <>
      {props.showFlag ? (
        <div className="modal">
          a
          <button onClick={closeModal}>✖️</button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Modal;
