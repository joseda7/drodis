import {useState} from 'react'
import CardButton from '../CardButton/CardButton';

interface Props {
    arr: Array<any>
}

function CardButtons({arr}:Props) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleCardSelect = (item:object, index:number) => { 
        if (selectedIndex !== index) {
            setSelectedIndex(index);
            // setSelectedWord(item);
        } else {
            setSelectedIndex(-1);
        }
    }

    return (
        <>
            {
                arr.map((item, index) => {
                    return (
                        <CardButton 
                            key = {item.id}
                            className = {(selectedIndex === index ? 'cardbutton--active ':'' + (selectedIndex !== -1 ? 'cardbutton--opaque':''))}
                            name = {item.name}
                            category = {item.category}
                            isDisabled = {false}
                            onClick = {() => handleCardSelect(item, index)}
                        />
                        
                    );
                })
            }
        </>
    )
}

export default CardButtons