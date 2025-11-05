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
        // Page backgrounds - Dark slate instead of pure black
        'bg': {
          value: {
            base: 'gray.50',
            _dark: '#1a1d23', // Soft dark slate
          },
        },
        // Panel/Card/Modal backgrounds - Slightly lighter than page
        'bg.panel': {
          value: {
            base: 'white',
            _dark: '#252932', // Lighter slate for cards/panels
          },
        },
        'bg.subtle': {
          value: {
            base: 'gray.100',
            _dark: '#2d333d', // Even lighter for hover states
          },
        },
        'bg.emphasized': {
          value: {
            base: 'gray.200',
            _dark: '#363d4a', // For selected/active states
          },
        },
        // Foreground (text) colors - Off-white instead of pure white
        'fg': {
          value: {
            base: 'gray.900',
            _dark: '#e8eaed', // Soft off-white for text
          },
        },
        'fg.muted': {
          value: {
            base: 'gray.600',
            _dark: '#a8b0bb', // Medium gray for secondary text
          },
        },
        'fg.subtle': {
          value: {
            base: 'gray.500',
            _dark: '#7d8694', // Subtle gray for hints/placeholders
          },
        },
        // Border colors
        'border': {
          value: {
            base: 'gray.200',
            _dark: '#363d4a', // Subtle borders
          },
        },
        'border.emphasized': {
          value: {
            base: 'gray.300',
            _dark: '#4a5260', // More visible borders
          },
        },
        // Accent colors remain vibrant
        'accent': {
          value: {
            base: 'brand.500',
            _dark: 'brand.400',
          },
        },
        // Action button colors for Edit/Delete
        'edit.text': {
          value: {
            base: 'blue.600',
            _dark: '#5ba3f5', // Brighter blue for dark mode
          },
        },
        'edit.bg.hover': {
          value: {
            base: 'blue.50',
            _dark: '#1e3a5f', // Dark blue background on hover
          },
        },
        'delete.text': {
          value: {
            base: 'red.600',
            _dark: '#f87171', // Brighter red for dark mode
          },
        },
        'delete.bg.hover': {
          value: {
            base: 'red.50',
            _dark: '#4a1f1f', // Dark red background on hover
          },
        },
      },
    },
    recipes: {
      button: {
        variants: {
          variant: {
            outline: {
              bg: {
                base: 'transparent',
                _dark: '#3a4250', // Much lighter gray for buttons
              },
              _hover: {
                bg: {
                  base: 'gray.50',
                  _dark: '#454d5e', // Even lighter on hover
                },
              },
            },
          },
          colorPalette: {
            blue: {
              // Specific styling for Edit buttons
              _dark: {
                bg: '#6bb3ff33', // Light blue background (20% opacity)
                color: '#6bb3ff', // Bright blue text
                borderColor: '#6bb3ff',
                _hover: {
                  bg: '#6bb3ff4d', // Slightly more opaque on hover (30%)
                  color: '#8ec5ff', // Even brighter on hover
                },
              },
            },
            red: {
              // Specific styling for Delete buttons
              _dark: {
                bg: '#ff6b6b33', // Light red background (20% opacity)
                color: '#ff6b6b', // Bright red text
                borderColor: '#ff6b6b',
                _hover: {
                  bg: '#ff6b6b4d', // Slightly more opaque on hover (30%)
                  color: '#ff8e8e', // Even brighter on hover
                },
              },
            },
          },
        },
      },
    },
  },
  cssVarsRoot: ':where(:root, :host)',
  globalCss: {
    'html, body': {
      bg: 'bg',
      color: 'fg',
      colorPalette: 'brand',
      margin: 0,
      padding: 0,
      transition: 'background-color 0.2s, color 0.2s',
    },
    '#root': {
      minHeight: '100vh',
      bg: 'bg',
      color: 'fg',
    },
    '*': {
      borderColor: 'border',
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
