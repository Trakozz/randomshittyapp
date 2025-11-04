import { NumberInput as ChakraNumberInput, IconButton, Group } from '@chakra-ui/react'
import * as React from 'react'

export const NumberInputRoot = React.forwardRef(
  function NumberInput(props, ref) {
    const { children, hideControls, useMobileStepper, ...rest } = props
    
    if (useMobileStepper) {
      return (
        <ChakraNumberInput.Root ref={ref} variant='outline' {...rest}>
          <Group attached width="full">
            <ChakraNumberInput.DecrementTrigger asChild>
              <IconButton variant="outline" size={rest.size}>
                -
              </IconButton>
            </ChakraNumberInput.DecrementTrigger>
            {children}
            <ChakraNumberInput.IncrementTrigger asChild>
              <IconButton variant="outline" size={rest.size}>
                +
              </IconButton>
            </ChakraNumberInput.IncrementTrigger>
          </Group>
        </ChakraNumberInput.Root>
      )
    }
    
    return (
      <ChakraNumberInput.Root ref={ref} variant='outline' {...rest}>
        {children}
        {!hideControls && (
          <ChakraNumberInput.Control>
            <ChakraNumberInput.IncrementTrigger />
            <ChakraNumberInput.DecrementTrigger />
          </ChakraNumberInput.Control>
        )}
      </ChakraNumberInput.Root>
    )
  },
)

export const NumberInputField = ChakraNumberInput.Input
export const NumberInputScrubber = ChakraNumberInput.Scrubber
export const NumberInputLabel = ChakraNumberInput.Label
