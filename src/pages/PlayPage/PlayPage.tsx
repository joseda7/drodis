
import Button from '../../components/Button/Button'
import { useLocation } from 'wouter'
import { useState, useEffect, useContext } from 'react'
import { SetupContext } from '../../context/setupContext'
import Modal from '../../components/Modal/Modal'
import './PlayPage.css'

function PlayPage() {
    const setupCtxt = useContext(SetupContext);
    const [location, setLocation] = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [counter, setCounter] = useState(60);
    const currentWord = setupCtxt && setupCtxt.setup.wordToDraw;

    useEffect(() => {
        const interval = setInterval(() => {counter > -1 ? setCounter(counter - 1) : setIsModalOpen(true)} , 1000);    
        return () => clearInterval(interval);
    });

    return (  
        <div className="playPage">
                <br/>
                <p className='playPage_timer'> {counter > 0 ? counter:"0"} </p>
                <p className='playPage_category'> 
                    ✍ Estás dibujando 
                    <br/>
                </p> 
                <p style={{fontSize:'1em'}} className = {'category_label '+ 'category_label--' + currentWord?.category.toLowerCase() }> {currentWord?.category} </p>
                <br/><br/>
                <Button color="tertiary" onClick={()=>{setIsModalOpen(true)}}>
                    Finalizar turno ✔
                </Button>
                {
                    isModalOpen && (
                        <Modal>
                            <h3> ¡Wepajé! </h3>
                            <p style={{textAlign:'center'}}> 
                                La palabra era:
                                <br />
                                <span style={{fontSize:'1.5em'}}><b> { currentWord?.name } </b></span> 
                            </p>
                            <p className='tip'> 
                                Si tu equipo adivinó a tiempo, suman <b>+1 punto</b>✨. Pasa el turno a otro equipo y sigue jugando.
                            </p> 
                            <div>    
                                <Button onClick={ () => setLocation("/") }>
                                    Seguir jugando 💫
                                </Button>  
                                <br />
                                <a href="https://forms.gle/zjCJFHTTEqYKKgBD8" target='_blank' className='feedbackTxt'> <p> Ayúdanos a mejorar Drodis </p> </a>
                            </div>
                        </Modal>
                    )
                }
        </div>   
    )
}

export default PlayPage


// Agregar al equipo de trabajo
// Eliminar la segunda pantalla después de elegir palabra (o dejarla opcional)
// Revisar algoritmo de randomización de palabras para que no se repitan
// Estatua de la libertad es un lugar! cambiar
 