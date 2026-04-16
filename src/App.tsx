import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from '@/pages/Home/HomePage'
import { NewRoundPage } from '@/pages/NewRound/NewRoundPage'
import { WordSelectionPage } from '@/pages/WordSelection/WordSelectionPage'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/nueva-partida', element: <NewRoundPage /> },
  { path: '/seleccionar-palabra', element: <WordSelectionPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
