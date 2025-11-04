import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e3f2fd' },
          100: { value: '#bbdefb' },
          200: { value: '#90caf9' },
          300: { value: '#64b5f6' },
          400: { value: '#42a5f5' },
          500: { value: '#2196f3' },
          600: { value: '#1e88e5' },
          700: { value: '#1976d2' },
          800: { value: '#1565c0' },
          900: { value: '#0d47a1' },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Page backgrounds
        'bg': {
          value: {
            base: 'gray.900',
            _light: 'gray.50',
          },
        },
        // Panel/Card/Modal backgrounds
        'bg.panel': {
          value: {
            base: 'gray.800',
            _light: 'white',
          },
        },
        'bg.subtle': {
          value: {
            base: 'gray.700',
            _light: 'gray.100',
          },
        },
        // Foreground (text) colors
        'fg': {
          value: {
            base: 'gray.50',
            _light: 'gray.900',
          },
        },
        'fg.muted': {
          value: {
            base: 'gray.400',
            _light: 'gray.600',
          },
        },
        'fg.subtle': {
          value: {
            base: 'gray.500',
            _light: 'gray.500',
          },
        },
        // Border colors
        'border': {
          value: {
            base: 'gray.700',
            _light: 'gray.200',
          },
        },
        'border.emphasized': {
          value: {
            base: 'gray.600',
            _light: 'gray.300',
          },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'bg',
      color: 'fg',
      colorPalette: 'blue',
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
