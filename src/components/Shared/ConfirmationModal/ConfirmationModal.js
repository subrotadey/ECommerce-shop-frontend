import React from "react";

const ConfirmationModal = ({
  title,
  message,
  successButtonName,
  closeModal,
  modalData,
  successAction,
}) => {
  return (
    <div >
      <input type="checkbox" id="confirmation-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box bg-white">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="py-4">{message}</p>
          <div className="modal-action bg-white">
            <label
              onClick={() => successAction(modalData)}
              htmlFor="confirmation-modal"
              className="btn btn-sm btn-error"
            >
              {successButtonName}
            </label>
            <button onClick={closeModal} className="btn-outline btn btn-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
