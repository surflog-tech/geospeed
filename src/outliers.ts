function sortAscending(a: number, b: number) {
  return a - b;
}

// return the median of a sorted array of numbers
function median(array: number[]) {
  const middle = Math.floor(array.length / 2);
  return array.length % 2 === 0 ? ((array[middle - 1] + array[middle]) / 2) : array[middle];
}

// compute the interquartile range for a sorted array of values
function interquartile(array: number[], g = 1.5) {
  const length = array.length;
  const q1 = median(array.slice(0, Math.trunc((length / 2))));
  const q3 = median(array.slice(Math.ceil(length / 2)));
  return (q3 - q1) * g;
}

// filter out outliers from an array
function outlierFilter<T>(array: T[], key: keyof T) {
  const values = array.map(({[key]: value}) => value as unknown as number).sort(sortAscending);
  const middle = median(values);
  const range = interquartile(values);
  return array.filter(({[key]: value}) => Math.abs((value as unknown as number) - middle) < range);
}

export {
  outlierFilter,
};
