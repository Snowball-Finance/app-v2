import { useState, createContext, useContext } from 'react';

const NotficationContext = createContext(null);

const NotficationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addPartialInvestment = ({ isFixMyPool, buttonText, fromContext }) => {
    if (fromContext) {
      setNotifications(() => [{ isFixMyPool, buttonText, fromContext }]);
    } else {
      setNotifications((prev) => [
        ...prev,
        { isFixMyPool, buttonText, fromContext },
      ]);
    }
  };

  return (
    <NotficationContext.Provider
      value={{
        notifications,
        addPartialInvestment,
      }}
    >
      {children}
    </NotficationContext.Provider>
  );
};

const useNotification = () => {
  const { notifications, addPartialInvestment } = useContext(
    NotficationContext
  );

  return {
    notifications,
    addPartialInvestment,
  };
};

export { NotficationProvider, useNotification };
