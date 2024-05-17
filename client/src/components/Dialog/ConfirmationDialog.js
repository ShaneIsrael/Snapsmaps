import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

function ConfirmationDialog({
  open,
  title,
  body,
  actionText,
  actionColor,
  cancelColor,
  cancelText,
  onAction,
  onCancel,
}) {
  return (
    <Modal
      isOpen={open}
      backdrop="blur"
      className="dark bg-slate-950 rounded-none sm:rounded-lg my-0 mx-0"
      hideCloseButton
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-2xl text-default-900 pb-0">{title}</ModalHeader>
            {body && <ModalBody className="text-default-600">{body}</ModalBody>}
            <ModalFooter className="pt-0">
              <Button color={cancelColor || 'danger'} variant="bordered" onPress={onCancel}>
                {cancelText || 'Cancel'}
              </Button>
              <Button color={actionColor || 'primary'} onPress={onAction}>
                {actionText || 'Ok'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ConfirmationDialog
