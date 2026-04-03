import { Route, Router } from "wouter"
import HomePage from './pages/HomePage/HomePage'
import PlayPage from './pages/PlayPage/PlayPage'
import './App.css'
import { SetupProvider } from "./context/setupContext"

function App() {
  return ( 
    <Router base="/drodis">
    {/* <Router> */}
      <SetupProvider>   
        <div className="App">
            <Route path = "/" component = { HomePage }/>
            <Route path = "/play" component = { PlayPage }/> 
        </div>
      </SetupProvider>
    </Router>
  )
}

export default App
