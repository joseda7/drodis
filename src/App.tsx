import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SettingsProvider } from '@/context/SettingsContext'
import { GameProvider } from '@/context/GameContext'
import { HomePage } from '@/pages/Home/HomePage'
import { GeneralConfigPage } from '@/pages/Settings/GeneralConfigPage'
import { GameSetupPage } from '@/pages/GameSetup/GameSetupPage'
import { GamePage } from '@/pages/Game/GamePage'
import { ResultsPage } from '@/pages/Results/ResultsPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/settings', element: <GeneralConfigPage /> },
  { path: '/:gameId/config', element: <GameSetupPage /> },
  { path: '/:gameId/results', element: <ResultsPage /> },
  { path: '/:gameId', element: <GamePage /> },
])

export default function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <RouterProvider router={router} />
      </GameProvider>
    </SettingsProvider>
  )
}
