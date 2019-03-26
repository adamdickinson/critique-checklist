import React, { Dispatch, useState } from "react"

interface DialogHook<T, D> {
  dialog?: T
  dialogData?: D
  openDialog: (dialog: T, data?: D) => void
  closeAllDialogs: () => void
}

function useDialog<T, D>(): DialogHook<T, D> {
  const [dialog, setDialog] = useState<T>(null)
  const [data, setData] = useState<D>(null)

  const openDialog = (dialog: T, data: D) => {
    setDialog(dialog)
    setData(data)
  }

  return {
    closeAllDialogs: () => openDialog(null, null),
    dialog,
    dialogData: data,
    openDialog
  }
}

export = useDialog 
