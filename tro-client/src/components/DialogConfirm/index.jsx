import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'

const DialogConfirm = ({open, onClose, title, description, handleOk, ...rest}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" {...rest}>
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline"  onClick={onClose}>Thoát</Button>
          <Button variant="default" onClick={handleOk}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogConfirm