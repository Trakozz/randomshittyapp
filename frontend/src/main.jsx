import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from './components/ui/provider'
import { Spinner, Center } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'

// Eager load: Home page (initial route)
import { HomePage } from '@features/home'

// Lazy load: Feature pages (loaded on-demand)
const PresetsPage = lazy(() => import('@features/presets').then(m => ({ default: m.PresetsPage })))
const CardsPage = lazy(() => import('@features/cards').then(m => ({ default: m.CardsPage })))
const CardCreatePage = lazy(() => import('@features/cards').then(m => ({ default: m.CardCreatePage })))
const DecksPage = lazy(() => import('@features/decks').then(m => ({ default: m.DecksPage })))
const DeckDetailsPage = lazy(() => import('@features/decks').then(m => ({ default: m.DeckDetailsPage })))

// Loading fallback component
const PageLoader = () => (
  <Center h="100vh">
    <Spinner size="xl" color="blue.500" />
  </Center>
)

// Create router with all routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'presets',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PresetsPage />
          </Suspense>
        )
      },
      {
        path: 'cards',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CardsPage />
          </Suspense>
        )
      },
      {
        path: 'cards/create',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CardCreatePage />
          </Suspense>
        )
      },
      {
        path: 'cards/edit/:cardId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CardCreatePage />
          </Suspense>
        )
      },
      {
        path: 'decks',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DecksPage />
          </Suspense>
        )
      },
      {
        path: 'decks/:deckId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DeckDetailsPage />
          </Suspense>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
