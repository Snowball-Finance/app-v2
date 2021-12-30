import { useState, createContext, useContext } from 'react';

const NotficationContext = createContext(null);

const NotficationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addPartialInvestment = ({ isFixMyPool, buttonText, fromContext }) => {
    setNotifications(() => [{ isFixMyPool, buttonText, fromContext }]);
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
