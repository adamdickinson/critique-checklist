import React, { Dispatch, useState } from "react"

interface DialogHook<T> {
  dialog?: T
  openDialog: Dispatch<React.SetStateAction<T>>
  closeAllDialogs: () => void
}

function useDialog<T>(defaultValue: T): DialogHook<T> {
  const [dialog, openDialog] = useState<T>(defaultValue)
  const closeAllDialogs = () => openDialog(defaultValue)
  return { dialog, openDialog, closeAllDialogs }
}

export = useDialog 
