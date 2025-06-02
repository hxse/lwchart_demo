function areFirstPointsEqual(firstNew, firstOld) {
  if (!firstNew || !firstOld) return false;
  return Object.keys(firstNew).every((key) => firstOld.hasOwnProperty(key) && firstNew[key] === firstOld[key]);
}

export function shouldUpdateLastPoint(newLength, oldLength, dataObj, previousDataObj, paramName) {
  if (dataObj[paramName].redraw) return "all";
  if (
    newLength > 0 &&
    oldLength > 0 &&
    dataObj[paramName].data[0]?.time === previousDataObj[paramName].data[0]?.time &&
    dataObj[paramName].data[newLength - 1]?.time === previousDataObj[paramName].data[oldLength - 1]?.time
  ) {
    const firstNew = dataObj[paramName].data[0];
    const firstOld = previousDataObj[paramName].data[0];
    const lastNew = dataObj[paramName].data[newLength - 1];
    const lastOld = previousDataObj[paramName].data[oldLength - 1];
    const lastNew2 = dataObj[paramName].data[newLength - 2];
    const lastOld2 = previousDataObj[paramName].data[oldLength - 2];

    // console.log(dataObj[paramName].data.length, previousDataObj[paramName].data.length);
    if (areFirstPointsEqual(firstNew, firstOld) && areFirstPointsEqual(lastNew2, lastOld2)) {
      if (areFirstPointsEqual(lastNew, lastOld)) {
        return "none";
      } else {
        return "last";
      }
    }
  }
  return "all";
}
