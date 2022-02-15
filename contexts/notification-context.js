import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { differenceInCalendarWeeks } from "date-fns";

import { OPTIMIZER, NOTIFICATION_TYPE } from "Layout/Shared/Notification/constants";

const NotficationContext = createContext(null);

const NotficationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { pathname } = useRouter();

  useEffect(() => {
    const optimizerNotification = JSON.parse(
      localStorage.getItem("optimizerNotification")
    );
    if (!optimizerNotification) {
      addOptimizerPoolNotification();
      setNotifications((prev) => [
        ...prev,
        { key: OPTIMIZER, type: NOTIFICATION_TYPE },
      ]);
    } else if (!optimizerNotification.dismiss) {
      setNotifications((prev) => [
        ...prev,
        { key: OPTIMIZER, type: NOTIFICATION_TYPE },
      ]);
    }
  }, []);

  useEffect(() => {
    const optimizerNotification = JSON.parse(
      localStorage.getItem("optimizerNotification")
    );
    if (
      differenceInCalendarWeeks(
        new Date(),
        new Date(optimizerNotification.timestamp)
      ) > 2 &&
      optimizerNotification.dismiss
    ) {
      addOptimizerPoolNotification();
      if (notifications.findIndex((item) => item.key === OPTIMIZER) === -1) {
        setNotifications((prev) => [
          ...prev,
          { key: OPTIMIZER, type: NOTIFICATION_TYPE },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const addOptimizerPoolNotification = () => {
    localStorage.setItem(
      "optimizerNotification",
      JSON.stringify({
        timestamp: new Date(),
        dismiss: false,
      })
    );
  };

  const removeOptimizerPoolNotification = () => {
    localStorage.setItem(
      "optimizerNotification",
      JSON.stringify({ timestamp: new Date(), dismiss: true })
    );
    const filteredNotification = notifications.filter(
      (item) => item.key !== OPTIMIZER
    );
    setNotifications(filteredNotification);
  };

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
        removeOptimizerPoolNotification,
      }}
    >
      {children}
    </NotficationContext.Provider>
  );
};

const useNotification = () => {
  const {
    notifications,
    addPartialInvestment,
    removeOptimizerPoolNotification,
  } = useContext(NotficationContext);

  return {
    notifications,
    addPartialInvestment,
    removeOptimizerPoolNotification,
  };
};

export { NotficationProvider, useNotification };
