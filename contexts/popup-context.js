import { createContext, useState, useCallback, useContext } from 'react'

import SnowConfirmDialog from 'parts/SnowConfirmDialog'

const initInfo = {
  title: 'Alert',
  text: '',
  cancelLabel: 'Ok'
}
const PopupContext = createContext(null)

const PopupProvider = ({ children }) => {

  const [open, setOpen] = useState(false)
  const [popupInfo, setPopupInfo] = useState(initInfo)
  const [confirmed, setConfirmed] = useState(false)

  const closePopUpHandler = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const closePopUpHandlerAndConfirm = useCallback(() => {
    setOpen(false)
    setConfirmed(true)
  }, [setOpen])

  return (
    <PopupContext.Provider
      value={{
        setOpen,
        setPopupInfo,
        confirmed
      }}
    >
      {open &&
        <SnowConfirmDialog
          open={open}
          title={popupInfo?.title}
          text={popupInfo?.text}
          confirmLabel={popupInfo?.cancelLabel}
          onConfirm={closePopUpHandlerAndConfirm}
          onClose={closePopUpHandler}
        />
      }
      {children}
    </PopupContext.Provider>
  )
}

const usePopup = () => {
  const {
    setOpen,
    setPopupInfo,
    confirmed
  } = useContext(PopupContext)

  const setPopUp = useCallback((data) => {
    setPopupInfo({
      ...initInfo,
      ...data
    })
    setOpen(true)
  }, [setPopupInfo, setOpen])

  return {
    setPopUp,
    confirmed
  }
}

export {
  PopupProvider,
  usePopup
}