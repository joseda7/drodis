import './CardButton.css'

interface Props {
  name: string;
  category: string;
  className: string;
  isDisabled?: boolean;
  onClick: () => void;
}

function CardButton({name, category, className, isDisabled, onClick}:Props) {
    return (
        <button
            className = {'cardbutton ' + className}  
            onClick = {onClick} 
            disabled = {isDisabled}>
                {name} 
                <span className={'carbutton_category ' + 'category_label category_label--' + category.toLowerCase()} > {category} </span> 
        </button>
    )
}

export default CardButton