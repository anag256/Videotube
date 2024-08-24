import { PropsWithChildren } from "react";
import Modal from "react-modal";
import { RxCross2 } from "react-icons/rx";
Modal.setAppElement("#root");

interface ModalPopoverProps extends PropsWithChildren {
  onClose: () => void;
  [x: string]: any;
}


function ModalPopover({
  children,
  isOpen,
  onClose,
  ...restProps
}: ModalPopoverProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Modal"
      closeTimeoutMS={500}
      {...restProps}
    >
      <RxCross2
        size={25}
        color="#fff"
        style={{ position: "absolute", right: 15, top: 15, cursor: "pointer" }}
        onClick={onClose}
      />
      {children}
    </Modal>
  );
}

export default ModalPopover;
