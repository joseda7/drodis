import { ReactNode, useState } from 'react'
import './HiddenButton.css'

interface Props {
    children: ReactNode;
    className?: string;
}

function HiddenButton({children, className}:Props) {
    const [isHidden, setIsHidden] = useState(true);
    return (
        <button className={className ? 'hiddenbtn ' + className: 'hiddenbtn'} 
            onPointerDown={() => {setIsHidden(false)}} 
            onPointerUp={() => {setIsHidden(true)}}
        >
            <span className={isHidden ? 'hiddenbtn-txt hiddenbtn-txt--hidden':'hiddenbtn-txt'}>
                { children }
            </span>
            <i> {isHidden ? '🙈':'🙉'} </i> 
        </button>
    )
}

export default HiddenButton


 