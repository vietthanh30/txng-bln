import moment from 'moment';

export const isNull = data => {
  return data === undefined || data === null;
};

export const isEmptyArray = data => {
  return Array.isArray(data) && data.length === 0;
};

export const isEmptyString = data => {
  return typeof data === 'string' && data.length === 0;
};

export const isEmptyObject = data => {
  return typeof data === 'object' && Object.keys(data).length === 0;
};

export const isNullOrEmpty = data => {
  let result = false;
  const dataIsNull = isNull(data);
  if (dataIsNull) {
    result = true;
  } else {
    const dataIsEmptyArray = isEmptyArray(data);
    const dataIsEmptyObject = isEmptyObject(data);
    const dataIsEmptyString = isEmptyString(data);
    if (dataIsEmptyArray || dataIsEmptyObject || dataIsEmptyString) {
      result = true;
    }
  }
  return result;
};

export function formatTime(time) {
  return moment(time).format('DD/MM/YYYY');
}
