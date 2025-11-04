import './App.css'
import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@components'

function App() {
  return (
    <Box minH="100vh">
      <Header />
      {/* Add margin-top to account for fixed header */}
      <Box mt="70px">
        <Outlet />
      </Box>
      <Toaster />
    </Box>
  )
}

export default App
