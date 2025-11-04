import { useState } from 'react'
import { Box, Button, Image, Text, VStack, HStack, FileUpload } from '@chakra-ui/react'
import { HiUpload, HiX } from 'react-icons/hi'
import { API_BASE_URL } from '@constants/api'

/**
 * TypeIconUpload Component
 * 
 * Handles icon file selection and preview for card types using Chakra UI FileUpload.
 * Supports SVG, PNG, JPG formats. The actual upload happens when the modal is saved.
 * 
 * @param {Function} onFileSelect - Callback when file is selected (receives File object)
 * @param {string} currentIconPath - Optional: Current icon path for preview
 */
export const TypeIconUpload = ({ onFileSelect, currentIconPath = null }) => {
  const [preview, setPreview] = useState(currentIconPath)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileAccept = (details) => {
    console.log('File accepted:', details)
    const file = details.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)

      // Notify parent component about file selection
      if (onFileSelect) {
        onFileSelect(file)
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileReject = (details) => {
    console.log('File rejected:', details)
    const firstFile = details.files?.[0]
    if (firstFile?.errors?.length > 0) {
      const errorMsg = firstFile.errors[0].message || 'File rejected'
      console.error('Rejection reason:', errorMsg)
      setError(errorMsg)
    }
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setPreview(currentIconPath)
    setError(null)
    
    // Notify parent component that file was cleared
    if (onFileSelect) {
      onFileSelect(null)
    }
  }

  const getIconUrl = (iconPath) => {
    if (!iconPath) return null
    if (iconPath.startsWith('data:')) return iconPath // Preview data URL
    // Extract filename from path and build API URL
    const filename = iconPath.split('/').pop()
    return `${API_BASE_URL}/types/icon/${filename}`
  }

  return (
    <VStack align="stretch" gap={4}>
      <Box>
        <Text fontWeight="medium" mb={2}>Icon</Text>
        <FileUpload.Root
          accept={{
            'image/svg+xml': ['.svg'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
          }}
          maxFiles={1}
          maxFileSize={5 * 1024 * 1024} // 5MB
          onFileAccept={handleFileAccept}
          onFileReject={handleFileReject}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Trigger asChild>
            <Button variant="outline" size="sm" width="full">
              <HiUpload /> Choose Icon (SVG, PNG, JPG)
            </Button>
          </FileUpload.Trigger>
        </FileUpload.Root>
        {error && (
          <Text color="red.500" fontSize="sm" mt={2}>
            {error}
          </Text>
        )}
      </Box>

      {preview && (
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">Preview:</Text>
            {selectedFile && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={handleClearFile}
              >
                <HiX /> Clear
              </Button>
            )}
          </HStack>
          <HStack gap={4}>
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              bg="gray.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={getIconUrl(preview)}
                alt="Icon preview"
                maxH="100px"
                maxW="100px"
                objectFit="contain"
              />
            </Box>
            {selectedFile && (
              <VStack align="start" flex={1}>
                <Text fontSize="sm" fontWeight="medium">
                  {selectedFile.name}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </Text>
              </VStack>
            )}
          </HStack>
        </Box>
      )}
    </VStack>
  )
}
