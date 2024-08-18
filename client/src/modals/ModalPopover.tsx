import { PropsWithChildren, useState } from "react";
import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";
Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    background:'#555555',
    borderRadius: '1rem',
  },
  // overlay: {
  //   position: 'fixed',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'transparent',
  //   filter: 'blur(4px)'
  // },
};

interface ModalPopoverProps extends PropsWithChildren {
  onClose:()=>void;
  [x: string]: any;
}
function ModalPopover({ children, onClose,...restProps }: ModalPopoverProps) {
  const [modalIsOpen, setIsOpen] = useState(false);
  // function openModal() {
  //   setIsOpen(true);
  // }

  function closeModal() {
    onClose();
    setIsOpen(false);
  }
  return (
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        // onAfterClose={}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        {...restProps}
      >
        <RxCross2  size={25} color="#fff" style={{position:'absolute',right:15,top:15,cursor:'pointer'}} onClick={closeModal}/>
        {children}
      </Modal>

  );
}

export default ModalPopover;
