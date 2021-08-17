// import incrgrubbs from '@stdlib/stats-incr-grubbs';
import { indexOfMADoutliers } from './stat';

type List = {
  [key: string]: number;
}

const threshold = 5;

function filterOutliers(data: List[], key: string): List[] {
  // const dataSorted = [...data].sort(({ [key]: a }, { [key]: b }) => a - b);
  // const values = dataSorted.map(({ [key]: value }) => value);
  const values = data.map(({ [key]: value }) => value);
  const indexes = indexOfMADoutliers(values, threshold);
  return data.filter((_, index) => indexes.includes(index) === false);
  // return dataSorted;
}


// function grubbsFilter(data: List[], key: string): List[] {
//   // return data;
//   // const accumulator = incrgrubbs({ init: data.length });
//   // const accumulator = incrgrubbs();
//   const accumulator = incrgrubbs({ init: 4 });
//   const dataSorted = [...data].sort(({ [key]: a }, { [key]: b }) => a - b);
//   dataSorted.forEach(({ [key]: value }) => accumulator(value));
//   const result = accumulator();
//   if (result === null) return dataSorted;
//   const { mean, sd, df } = result;
//   console.log(mean, sd, df);
//   return dataSorted.filter(({ [key]: value }) => {
//     return value < result.max;
//   });
//   // return dataSorted.filter(({ [key]: value }) => {
//   //   const result = accumulator(value);
//   //   // console.log(result?.max);
//   //   if (result === null) return true;
//   //   return value < result.max;
//   //   // if (result?.rejected) {
//   //   //   console.log(value);
//   //   // }
//   //   // return result?.rejected === false;
//   // });
// }

export {
  filterOutliers,
};
