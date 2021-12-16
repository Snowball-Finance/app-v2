import { useEffect, useState, createContext, useContext } from 'react';

const NotficationContext = createContext(null);

const NotficationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const initialNotifications = getNotificationsFromStorage();
    setNotifications(initialNotifications);
  }, []);

  const getNotificationsFromStorage = () => {
    return JSON.parse(localStorage.getItem('notifications')) || [];
  };

  const setNotificationsOnStorage = (data) => {
    localStorage.setItem('notifications', JSON.stringify(data));
  };

  const addNewNotification = ({ address, message }) => {
    const storedNotifications = [...getNotificationsFromStorage()];
    const totalNotifications = [
      ...storedNotifications,
      { read: false, address, message },
    ];
    setNotifications(totalNotifications);
    setNotificationsOnStorage(totalNotifications);
  };

  const deleteNotificationByAddress = (address) => {
    const storedNotifications = [...getNotificationsFromStorage()];
    const remainging = storedNotifications.filter(
      (item) => +item.address !== +address
    );
    setNotifications(remainging);
    setNotificationsOnStorage(remainging);
  };

  const readNotificationByAddress = (address) => {
    const storedNotifications = [...getNotificationsFromStorage()];
    const index = storedNotifications.findIndex(
      (item) => +item.address === +address
    );
    storedNotifications[index].read = true;
    setNotifications(storedNotifications);
    setNotificationsOnStorage(storedNotifications);
  };

  return (
    <NotficationContext.Provider
      value={{
        notifications,
        addNewNotification,
        deleteNotificationByAddress,
        readNotificationByAddress,
      }}
    >
      {children}
    </NotficationContext.Provider>
  );
};

const useNotification = () => {
  const {
    notifications,
    addNewNotification,
    deleteNotificationByAddress,
    readNotificationByAddress,
  } = useContext(NotficationContext);

  return {
    notifications,
    addNewNotification,
    deleteNotificationByAddress,
    readNotificationByAddress,
  };
};

export { NotficationProvider, useNotification };
