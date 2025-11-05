import { Heading, Flex, HStack, Container, Separator } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
import { ColorModeButton } from '../../components/ui/color-mode'

const Header = () => {
  return (
    <Flex
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      bg="bg.panel"
      borderBottomWidth="1px"
      borderColor="border"
      boxShadow="sm"
    >
      <Container maxW="container.2xl" py={4}>
        <Flex align="center" justify="space-between">
          {/* Logo/Brand */}
          <Heading as="h1" size="lg" fontWeight="bold">
            AscendanceV2
          </Heading>

          {/* Navigation Links */}
          <HStack gap={1} as="nav">
            
            <Separator orientation="vertical" height="6" mx={2} />
            <NavLink
              to="/"
              style={({ isActive }) => ({
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s',
                backgroundColor: isActive ? 'var(--chakra-colors-blue-500)' : 'transparent',
                color: isActive ? 'white' : 'var(--chakra-colors-fg)',
              })}
            >
              Home
            </NavLink>
            <Separator orientation="vertical" height="6" mx={2} />
            <NavLink
              to="/presets"
              style={({ isActive }) => ({
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s',
                backgroundColor: isActive ? 'var(--chakra-colors-blue-500)' : 'transparent',
                color: isActive ? 'white' : 'var(--chakra-colors-fg)',
              })}
            >
              Presets
            </NavLink>
            <Separator orientation="vertical" height="6" mx={2} />
            <NavLink
              to="/cards"
              style={({ isActive }) => ({
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s',
                backgroundColor: isActive ? 'var(--chakra-colors-blue-500)' : 'transparent',
                color: isActive ? 'white' : 'var(--chakra-colors-fg)',
              })}
            >
              Cards
            </NavLink>
            <Separator orientation="vertical" height="6" mx={2} />
            <NavLink
              to="/decks"
              style={({ isActive }) => ({
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s',
                backgroundColor: isActive ? 'var(--chakra-colors-blue-500)' : 'transparent',
                color: isActive ? 'white' : 'var(--chakra-colors-fg)',
              })}
            >
              Decks
            </NavLink>

            <Separator orientation="vertical" height="6" mx={2} />

            {/* Color Mode Toggle */}
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Flex>
  )
}

export default Header