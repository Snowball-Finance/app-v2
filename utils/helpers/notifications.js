export const getNotificationsFromStorage = () => {
  return JSON.parse(localStorage.getItem('notifications')) || "[]";
};

export const setNotificationsOnStorage = (data) => {
  localStorage.setItem('notifications', JSON.stringify(data));
};

export const addNewNotification = ({ address, message }) => {
  const storedNotifications = [...getNotificationsFromStorage()];
  const totalNotifications = [
    ...storedNotifications,
    { read: false, address, message },
  ];
  setNotificationsOnStorage(totalNotifications);
};

export const deleteNotificationByAddress = (address) => {
  const storedNotifications = [...getNotificationsFromStorage()];
  const remainging = storedNotifications.filter(
    (item) => +item.address !== +address
  );
  setNotificationsOnStorage(remainging);
};

export const readNotificationByAddress = (address) => {
  const storedNotifications = [...getNotificationsFromStorage()];
  const index = storedNotifications.findIndex(
    (item) => +item.address === +address
  );
  storedNotifications[index].read = true;
  setNotificationsOnStorage(storedNotifications);
};
