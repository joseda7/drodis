import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from '@/pages/Home/HomePage'
import { RoundSetupPage } from '@/pages/RoundSetup/RoundSetupPage'
import { NewRoundPage } from '@/pages/NewRound/NewRoundPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/:roundId/setup', element: <RoundSetupPage /> },
  { path: '/:roundId', element: <NewRoundPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
