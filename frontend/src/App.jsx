import './App.css'
import { Box, Container } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@components'

function App() {
  return (
    <Box minH="100vh">
      <Header />
      {/* Add margin-top to account for fixed header */}
      <Container maxW="container.2xl" mt="70px" px={4}>
        <Outlet />
      </Container>
      <Toaster />
    </Box>
  )
}

export default App
