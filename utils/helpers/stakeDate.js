import { getDayOffset, getEpochSecondForDay } from './date';

const WEEK = 7 * 86400;
const MAXTIME = 2 * 365 * 86400;

export const estimateXSnobForDate = (amount, unlockDate) => {
  const rounded = Math.floor(getEpochSecondForDay(unlockDate) / WEEK) * WEEK;
  return ((rounded - +new Date() / 1000) / MAXTIME) * amount;
};

export const estimateXSnobForPeriod = (amount, period) => {
  return estimateXSnobForDate(amount, getDayOffset(new Date(), period / 86400));
};

export const roundDateByXSnobEpochSeconds = (date) => {
  return Math.floor(getEpochSecondForDay(date) / WEEK) * WEEK;
};

export const roundDateByXSnobEpoch = (date) => {
  return new Date(Math.floor(getEpochSecondForDay(date) / WEEK) * WEEK * 1000);
};
