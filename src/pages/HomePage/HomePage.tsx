import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'wouter'
import { SetupContext } from '../../context/setupContext'
import { INITIAL_SETUP } from '../../constants/setup'
import { WordItem } from '../../interfaces/interfaces'
import { WORDS } from '../../constants/data'
import CardButton from '../../components/CardButton/CardButton'
import Button from '../../components/Button/Button'
import Modal from '../../components/Modal/Modal'
import HiddenButton from '../../components/HiddenButton/HiddenButton'
import Header from '../../components/Header/Header'
import './HomePage.css'

function HomePage() {
    const setupCtxt = useContext(SetupContext);
    
    const [selectedIndex, setSelectedIndex] = useState(-1); 
    const [selectedWord, setSelectedWord] = useState<WordItem|any>();
    const [shuffledArrWords, setShuffledArrWords] = useState<WordItem[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [randomizeChances, setCountRandomize] = useState(2);
    const [location, setLocation] = useLocation();

    const handleRandomize = () => {
        const shuffled = [...WORDS].sort(() => 0.5 - Math.random());
        setShuffledArrWords([shuffled[0], shuffled[5], shuffled[10]]);
    }

    const handleNewWords = () => {
        if (randomizeChances >= 1) {
            setCountRandomize(randomizeChances - 1);
            handleRandomize();
        }
    }

    const handleCardSelect = (item:object, index:number) => { 
        if (selectedIndex !== index) {
            setSelectedIndex(index);
            setSelectedWord(item);
        } else {
            setSelectedIndex(-1);
        }
    }
    
    const handleSelectWord = () => {
        let newWord:WordItem = {
            id: selectedWord.id,
            name: selectedWord.name,
            category: selectedWord.category
        }
        setupCtxt && setupCtxt.setSetup({...INITIAL_SETUP, wordToDraw:newWord});  // Update setup!
        setIsModalOpen(true);
    }

    const handleStartAgain = () => {
        setSelectedIndex(-1); 
        setIsModalOpen(false);
        setCountRandomize(2);
    } 

    useEffect(() => {
        handleRandomize();
    }, [])  

    return (
        <div className="homePage">
            <Header/>
            <section className="homePage_body">
                <p style={{marginTop:'0px', textAlign:'center'}}>
                    👉 Elige una palabra, memorízala <br></br> y prepárate para dibujar  
                </p>
                   
                {
                    shuffledArrWords?.map((item, index) => {
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
                {
                    selectedIndex !== -1 ? (
                        <>
                            <p className="tip">
                                🙊 Aún no la muestres a tu equipo, ya que deberán adivinarla mientras la dibujas    
                            </p>  
                            <Button onClick = { handleSelectWord }>
                                Me voy con esta ➡
                            </Button>
                        </>
                    ):(        
                        <>
                            <Button onClick = { handleNewWords } disabled = { randomizeChances < 1 } >
                                Nuevas palabras { randomizeChances > 1 ? '🔀🔀': randomizeChances === 1 ? '🔀🟦' : '🟦🟦' }
                            </Button>
                            {
                                randomizeChances < 1 && <p>* Se te acabaron las opciones. Elige una palabra para que puedas jugar</p>
                            }
                        </>
                    )
                }
            </section>

            {
                isModalOpen && (
                    <Modal>
                        <Button color='transparent' onClick={ handleStartAgain }>
                            &lt;  Volver a empezar
                        </Button>
                        <h3> ¿Todo listo? </h3>
                        <p className='tip'> 
                            🖌 <b>Prepara lápiz y papel</b>, o con lo que quieras dibujar, siempre que tu equipo pueda ver lo que haces.
                            <br/><br/>
                            ⌛ <b> Tienes 60 segundos </b> para que tu equipo adivine lo que dibujas. 
                        </p> 
                        <p> 
                            Si eres el dibujante haz clic para volver a ver la palabra  
                        </p> 
                        <HiddenButton>
                            {selectedWord?.name}
                            <span className = {'category_label '+ 'category_label--' + selectedWord?.category.toLowerCase() }> 
                                {selectedWord?.category} 
                            </span> 
                        </HiddenButton>
                        <div>    
                            <Button color="primary" onClick={ () => setLocation("/play") }>
                                Empezar a dibujar ✍
                            </Button>
                        </div>
                    </Modal>
                )
            }
            
        </div>
    )
}

export default HomePage