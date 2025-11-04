import { useState } from 'react'
import { Box, Button, Image, Text, VStack, HStack, FileUpload } from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { getApiUrl } from '@constants/api'

/**
 * ImageUploadField Component
 * 
 * Handles image file upload for illustrations using Chakra UI FileUpload.
 * Features:
 * - File preview before upload
 * - Upload progress indication
 * - Error handling
 * - Integration with React Hook Form
 * - Archetype-aware uploads
 * 
 * @param {Function} onUploadComplete - Callback when upload succeeds (receives illustration object)
 * @param {Function} setValue - React Hook Form setValue function
 * @param {string} currentIllustrationUrl - Optional: URL of currently selected illustration
 * @param {boolean} hidePreview - Optional: Hide the image preview
 * @param {number} archetypeId - Required: Archetype ID for organizing uploads
 */
export const ImageUploadField = ({ 
  onUploadComplete, 
  setValue,
  currentIllustrationUrl = null,
  hidePreview = false,
  archetypeId = null
}) => {
  const [preview, setPreview] = useState(currentIllustrationUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (details) => {
    const file = details.acceptedFiles?.[0]
    if (!file) return

    setError(null)
    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileReject = (details) => {
    if (details.files?.length > 0) {
      const file = details.files[0]
      if (file.errors?.length > 0) {
        setError(file.errors[0].message || 'File rejected')
      }
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('No file selected')
      return
    }

    if (!archetypeId) {
      setError('Archetype must be selected before uploading')
      return
    }

    console.log('Starting upload for file:', selectedFile.name, 'with archetype:', archetypeId)
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('archetype_id', archetypeId.toString())

      const uploadUrl = `${getApiUrl('illustrations')}/upload`
      console.log('Sending request to:', uploadUrl)
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload error response:', errorData)
        throw new Error(errorData.detail || 'Upload failed')
      }

      const illustration = await response.json()
      console.log('Upload successful:', illustration)
      
      // Update form field with illustration ID
      if (setValue) {
        setValue('illustration_id', illustration.id)
      }

      // Callback with illustration data
      if (onUploadComplete) {
        onUploadComplete(illustration)
      }

      setSelectedFile(null)
    } catch (err) {
      setError(err.message || 'Failed to upload image')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setPreview(null)
    setSelectedFile(null)
    setError(null)
    if (setValue) {
      setValue('illustration_id', '')
    }
  }

  return (
    <VStack align="stretch" gap={4}>
      {/* Error message when hidePreview is true */}
      {hidePreview && error && (
        <Text fontSize="sm" color="red.500">
          {error}
        </Text>
      )}

      {/* Preview - only show when hidePreview is false */}
      {!hidePreview && preview && (
        <Box
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="gray.300"
          borderRadius="md"
          p={4}
          textAlign="center"
        >
          <Image
            src={preview}
            alt="Preview"
            maxH="300px"
            maxW="100%"
            objectFit="contain"
            mx="auto"
          />
        </Box>
      )}

      {/* File Upload with Chakra UI */}
          <FileUpload.Root
            accept={{
              'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            }}
            maxFiles={1}
            maxFileSize={10 * 1024 * 1024} // 10MB
            onFileChange={handleFileChange}
            onFileReject={handleFileReject}
            disabled={uploading}
          >
            <FileUpload.HiddenInput />
            
            <FileUpload.Dropzone>
              <FileUpload.DropzoneContent>
                <Text fontSize="sm" color="gray.600">
                  Drag & drop an image here, or click to browse
                </Text>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>

            <HStack gap={2} mt={2}>
              <FileUpload.Trigger asChild>
                <Button variant="outline" disabled={uploading}>
                  Choose File
                </Button>
              </FileUpload.Trigger>
            </HStack>
          </FileUpload.Root>

          {/* Upload and Clear buttons outside FileUpload.Root */}
          <HStack gap={2}>
            {selectedFile && !uploading && (
              <Button
                colorPalette="blue"
                onClick={handleUpload}
              >
                Upload
              </Button>
            )}

            {preview && (
              <Button
                variant="outline"
                colorPalette="red"
                onClick={handleClear}
                disabled={uploading}
              >
                Clear
              </Button>
            )}
          </HStack>

          {/* Upload Status */}
          {uploading && (
            <Text fontSize="sm" color="blue.500">
              Uploading...
            </Text>
          )}

          {selectedFile && !uploading && (
            <Text fontSize="sm" color="gray.600">
              Ready to upload: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}KB)
            </Text>
          )}
      </VStack>
  )
}
