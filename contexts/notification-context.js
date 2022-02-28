import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { differenceInCalendarWeeks } from "date-fns";

import {
  OPTIMIZER,
  NOTIFICATION_TYPE,
  SNOW_DAY,
} from "Layout/Shared/Notification/constants";

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
      if (notifications.findIndex((item) => item.key === OPTIMIZER) === -1) {
        setNotifications((prev) => [
          ...prev,
          { key: OPTIMIZER, type: NOTIFICATION_TYPE },
        ]);
      }
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

  useEffect(() => {
    const date = new Date();
    let timer;
    const snowDayNotification = JSON.parse(
      localStorage.getItem("snowDayNotification")
    );

    const currentTime = date.getTime();
    const execTime = date.setUTCHours(23, 59, 59, 0); // UTC 00:00
    let timeLeft;
    if (currentTime < execTime && date.getUTCDay() === 4) {
      timeLeft = execTime - currentTime;
    } else {
      timeLeft = execTime + 86400000 - currentTime;
    }
    timer = setTimeout(function () {
      if (!snowDayNotification) {
        addSnowDayNotification();
        setNotifications((prev) => [
          ...prev,
          { key: SNOW_DAY, type: NOTIFICATION_TYPE },
        ]);
      } else if (snowDayNotification.dismiss) {
        addSnowDayNotification();
        if (notifications.findIndex((item) => item.key === SNOW_DAY) === -1) {
          setNotifications((prev) => [
            ...prev,
            { key: SNOW_DAY, type: NOTIFICATION_TYPE },
          ]);
        }
      }
    }, timeLeft);

    if (snowDayNotification && !snowDayNotification.dismiss) {
      if (notifications.findIndex((item) => item.key === SNOW_DAY) === -1) {
        setNotifications((prev) => [
          ...prev,
          { key: SNOW_DAY, type: NOTIFICATION_TYPE },
        ]);
      }
    }

    return () => {
      clearTimeout(timer);
    };
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

  const addSnowDayNotification = () => {
    localStorage.setItem(
      "snowDayNotification",
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

  const removeSnowDayNotification = () => {
    localStorage.setItem(
      "snowDayNotification",
      JSON.stringify({ timestamp: new Date(), dismiss: true })
    );
    const filteredNotification = notifications.filter(
      (item) => item.key !== SNOW_DAY
    );
    setNotifications(filteredNotification);
  };

  const dismissNotification = (key) => {
    if (key === OPTIMIZER) {
      removeOptimizerPoolNotification();
    } else if (key === SNOW_DAY) {
      removeSnowDayNotification();
    }
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
        dismissNotification,
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
    dismissNotification,
  } = useContext(NotficationContext);

  return {
    notifications,
    addPartialInvestment,
    removeOptimizerPoolNotification,
    dismissNotification,
  };
};

export { NotficationProvider, useNotification };
