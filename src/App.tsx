import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SettingsProvider } from '@/context/SettingsContext'
import { GameProvider } from '@/context/GameContext'
import { HomePage } from '@/pages/Home/HomePage'
import { SettingsPage } from '@/pages/Settings/SettingsPage'
import { GamePreConfigPage } from '@/pages/GamePreConfig/GamePreConfigPage'
import { GamePage } from '@/pages/Game/GamePage'
import { ResultsPage } from '@/pages/Results/ResultsPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/:gameId/config', element: <GamePreConfigPage /> },
  { path: '/:gameId/results', element: <ResultsPage /> },
  { path: '/:gameId', element: <GamePage /> },
], { basename: import.meta.env.BASE_URL })

export default function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <RouterProvider router={router} />
      </GameProvider>
    </SettingsProvider>
  )
}
