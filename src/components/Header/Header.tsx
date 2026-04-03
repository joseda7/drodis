import { useContext, useState } from 'react'
import Logo from '../../assets/logo-drodis.svg'
import { SetupContext } from '../../context/setupContext'
import Modal from '../Modal/Modal'
import './Header.css'

function Header() {
    const setupCtxt = useContext(SetupContext);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const handleChangeTime = (event:React.ChangeEvent<HTMLSelectElement>) => {
        console.log(event);
    } 
    return (
        <>
            <header className="header"> 
                <img className="logo" src={ Logo } alt="Logo Drodis" />
                {/* <label className="timeSelect"> Tiempo de dibujo (s): 
                    <select name="selectedTime" 
                        defaultValue={ setupCtxt?.setup.drawTime }
                        onChange={ handleChangeTime }>
                        <option value="40"> 40 </option>
                        <option value="60"> 60 </option>
                        <option value="80"> 80 </option>
                    </select> 
                </label> */}
                <button className="infoButton" onClick={()=>setIsInfoOpen(true)}> i </button>
            </header>
            {
                isInfoOpen && (
                    <Modal onClose={()=>setIsInfoOpen(false)}>
                        <div>
                            <img 
                                style={{marginTop:"30px", margin:"30px auto 0", height: "70px", display: "block"}} 
                                src={ Logo } 
                                alt="Logo Drodis"/>
                            <p> ¡Dibuja y adivina en equipo! </p>
                        </div>
                        <div>
                            <h2> Instrucciones </h2>
                            <p style={{fontSize:"0.9em"}}>
                                🤝 <b>Arma los equipos</b>, idealmente en parejas, aunque puedes armarlos como quieras.
                                <br/><br/>
                                🖌 <b>Prepara lápiz y papel</b>, o con lo que quieras dibujar, siempre que tu equipo pueda ver lo que haces.
                                <br/><br/>
                                ⌛ <b>Selecciona el tiempo de dibujo</b> en segundos (s).
                                <br/><br/>
                                👇 <b>Elige una palabra</b>, dibújala y tu equipo buscará adivinarla antes de que se acabe el tiempo.
                                <br/><br/>    
                                ✨ <b>Tu equipo suma +1 punto</b> si adivina. Si no, pasa el turno.
                                <br/><br/>
                            </p>
                            <p className="tip">
                                🔮 Si no te suena ninguna instrucción, usa Drodis como quieras, pero diviértete con tus seres queridos.
                            </p>    
                        </div>
                        <p style={{fontSize:"0.8em"}}> 
                            <i> Drodis v1.0 | 2023 </i> 
                        </p>
                    </Modal>
            )}
        </>
        
    )
}

export default Header