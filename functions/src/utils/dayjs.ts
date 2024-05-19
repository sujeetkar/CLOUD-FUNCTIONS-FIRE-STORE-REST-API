import dayjs from 'dayjs';

export const getCurrentJST = () => {
  // TODO format must be 'YYYY-MM-DD HH:mm:ss'
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
};

export const getAddToCurrentJST = (num: number, unit: dayjs.ManipulateType) => {
  // TODO
  const newDateTime = dayjs().add(num, unit);
  return newDateTime.format('YYYY-MM-DD HH:mm:ss')
};

export const isAfterCurrentJST = (time: string) => {
  // TODO
  const giventTime = dayjs(time);
  const currTime = dayjs();
  return giventTime.isAfter(currTime);
};
