import React from 'react'
import { useSnackbar } from 'notistack'

const InnerSnackbarUtilsConfigurator = ({ setUseSnackbarRef }) => {
  setUseSnackbarRef(useSnackbar())
  return null
}

let useSnackbarRef
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp
}

export const Snackbar = () => {
  return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
}

export default {
  success(msg) {
    this.toast(msg, 'success')
  },
  warning(msg) {
    this.toast(msg, 'warning')
  },
  info(msg) {
    this.toast(msg, 'info')
  },
  error(msg) {
    this.toast(msg, 'error')
  },
  toast(msg, variant = 'default', ...rest) {
    const options = {
      variant,
      preventDuplicate: true,
      ...rest
    }

    if (!useSnackbarRef) return null

    return useSnackbarRef.enqueueSnackbar(msg, options)
  },
  closeAll() {
    useSnackbarRef.closeSnackbar()
  },
  close(key) {
    useSnackbarRef.closeSnackbar(key)
  }
}
