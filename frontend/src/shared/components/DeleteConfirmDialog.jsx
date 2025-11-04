import { Button } from '@chakra-ui/react'
import { Dialog } from '@chakra-ui/react'

const DeleteConfirmDialog = ({ isOpen, onClose, entityType, onConfirm }) => {
  return (
    <Dialog.Root 
      open={isOpen} 
      onOpenChange={(e) => !e.open && onClose()}
      placement="center"
      size="sm"
      role="alertdialog"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Confirm Delete</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <p>Are you sure you want to delete this {entityType}?</p>
            <p>This action cannot be undone.</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.ActionTrigger>
            <Button colorPalette="red" onClick={onConfirm}>
              Delete
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

export default DeleteConfirmDialog
