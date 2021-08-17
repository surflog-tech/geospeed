// _inspired_ by https://github.com/alyssaq/stats-analysis

const thresholdDefault = 3.5; // Default recommended threshold
const probableError = 0.6745;

// const outlierMethod = {
//   MAD: 'MAD',
//   medianDiff: 'medianDiff'
// }

// function mean (arr: number[]) {
//   return (arr.reduce((prev, curr) => prev + curr, 0) / arr.length)
// }

// function variance (arr: number[]) {
//   const dataMean = mean(arr)
//   return mean(arr.map(function (val) {
//     return Math.pow(val - dataMean, 2)
//   }))
// }

// function stdev (arr: number[]) {
//   return Math.sqrt(variance(arr))
// }

function median (arr: number[]) {
  const half = Math.floor(arr.length / 2)
  arr = arr.slice(0).sort(numSorter)
  if (arr.length % 2) { // Odd length, true middle element
    return arr[half]
  } else { // Even length, average middle two elements
    return (arr[half - 1] + arr[half]) / 2.0
  }
}

function medianAbsoluteDeviation (arr: number[], dataMedian: number) {
  const absoluteDeviation = arr.map((val) => Math.abs(val - dataMedian))
  return median(absoluteDeviation)
}

function numSorter (a: number, b: number) {
  return a - b
}

// Iglewicz and Hoaglin method values with a Z-score > threshold are considered potential outliers
function isMADoutlier (val: number, threshold: number, dataMedian: number, dataMAD: number) {
  return Math.abs((probableError * (val - dataMedian)) / dataMAD) > threshold
}

function indexOfMADoutliers (arr: number[], threshold: number = thresholdDefault): number[] {
  const dataMedian = median(arr)
  const dataMAD = medianAbsoluteDeviation(arr, dataMedian)
  const init: number[] = [];
  return arr.reduce((res, val, i) => {
    if (isMADoutlier(val, threshold, dataMedian, dataMAD)) {
      res.push(i)
    }
    return res
  }, init)
}

// function filterMADoutliers (arr: number[], threshold: number): number[] {
//   threshold = threshold || 3.5 // Default recommended threshold
//   const dataMedian = median(arr)
//   const dataMAD = medianAbsoluteDeviation(arr, dataMedian)
//   return arr.filter(function (val) {
//     return !isMADoutlier(val, threshold, dataMedian, dataMAD)
//   })
// }

// Median filtering from difference between values
// function differences (arr: number[]) {
//   return arr.map(function (d, i) {
//     return Math.round(Math.abs(d - (arr[i - 1] || arr[0]))) + 1
//   })
// }

// function isMedianDiffOutlier (threshold: number, difference: number, medianDiff: number) {
//   return difference / medianDiff > threshold
// }

// function indexOfMedianDiffOutliers (arr, threshold) {
//   threshold = threshold || 3 // Default threshold of 3 std
//   const differencesArr = differences(arr)
//   const medianDiff = median(differencesArr)

//   return arr.reduce(function (res, val, i) {
//     if (isMedianDiffOutlier(threshold, differencesArr[i], medianDiff)) {
//       res.push(i)
//     }
//     return res
//   }, [])
// }

// function filterMedianDiffOutliers (arr: number[], threshold = 3): number[] {
//   const differencesArr = differences(arr)
//   const medianDiff = median(differencesArr)
//   return arr.filter(function (_, i) {
//     const outlier = isMedianDiffOutlier(threshold, differencesArr[i], medianDiff);
//     return outlier === false;
//   })
// }

// function filterOutliers (arr: number[], method = outlierMethod.MAD, threshold = 3): number[] {
//   switch (method) {
//     case outlierMethod.MAD:
//       return filterMADoutliers(arr, threshold)
//     default:
//       return filterMedianDiffOutliers(arr, threshold)
//   }
// }

// function indexOfOutliers (arr, method, threshold) {
//   switch (method) {
//     case outlierMethod.MAD:
//       return indexOfMADoutliers(arr, threshold)
//     default:
//       return indexOfMedianDiffOutliers(arr, threshold)
//   }
// }

export {
  // stdev: stdev,
  // mean: mean,
  // median: median,
  // MAD: medianAbsoluteDeviation,
  // numSorter: numSorter,
  // outlierMethod: outlierMethod,
  // filterOutliers,
  // indexOfOutliers: indexOfOutliers,
  // filterMADoutliers: filterMADoutliers,
  indexOfMADoutliers,
  // filterMedianDiffOutliers,
  // indexOfMedianDiffOutliers: indexOfMedianDiffOutliers
}
