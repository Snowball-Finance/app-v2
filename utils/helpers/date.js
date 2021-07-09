export const getDayDiff = (date1, date2) => {
  return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
};

export const getDayOffset = (date, offset) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + offset);
  return newDate;
};

export const getEpochSecondForDay = (date) => {
  return Math.ceil(date.getTime() / (1000 * 60 * 60 * 24)) * 60 * 60 * 24;
};

export const getWeekDiff = (date1, date2) => {
  return Math.ceil(
    (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24 * 7),
  );
};

export const getTimeEpoch = () => {
  return Math.ceil(new Date().getTime() / (1000 * 60 * 60 * 24)) * 60 * 60 * 24;
};

export const formatDate = (date) => {
  const value = new Date(date)
  return `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`;
};

export const dateFromEpoch = (epoch) => {
  const date = new Date();
  date.setTime(epoch * 1000);
  return date;
};
