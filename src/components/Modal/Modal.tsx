import { ReactNode } from 'react'
import './Modal.css'

interface Props {
    children: ReactNode;
    onClose?: ()=>void;
}

function Modal({children, onClose}:Props) {
  return (  
    <div className="modal">
        <div className="modal_body">
            {children}
        </div>
        {
          onClose && <button className='modal_close' onClick={onClose}> X </button>
        }
    </div>
  )
}

export default Modal