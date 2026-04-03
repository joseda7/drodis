import { ReactNode } from 'react';
import './Button.css'

interface Props {
  children: ReactNode;
  onClick: () => void;
  color?: "primary" | "secondary" | "tertiary" | "transparent"; 
  className?: string
  disabled?: boolean
}

function Button({children, onClick, color, className, disabled}:Props) {
  return (
    <button 
      className = { 'button ' + (color ? 'button_' + color : ' ') + (disabled ? 'button--disabled ':' ')}
      onClick = {onClick}
      disabled = {disabled}
    >
      {children}
    </button>
  )
}

export default Button
