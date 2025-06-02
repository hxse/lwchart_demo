import { simulateOHLCVData, simulateVolume, calculateSMA, calculateRSI } from "./generateData.js";

export function handleData(paramName, node) {
  let newData;
  if (paramName == "ohlc") {
    newData = simulateOHLCVData(node.params.series["ohlc"].count);
  } else if (paramName == "volume") {
    newData = simulateVolume(node.params.series["ohlc"].data);
  } else if (paramName == "sma") {
    newData = calculateSMA(node.params.series["ohlc"].data, node.params.series["sma"].period);
  } else if (paramName == "rsi") {
    newData = calculateRSI(node.params.series["ohlc"].data, node.params.series["rsi"].period);
  }
  return newData;
}

export function handleLastData(paramName, node) {
  if (paramName == "ohlc") {
    const series = node.params.series[paramName];
    const data = series.data;
    const items = data.slice(0, data.length - 1);
    let lastItem = data[data.length - 1];
    if (!lastItem) return;
    let newData = [
      ...items,
      {
        ...lastItem,
        close: lastItem.close + Math.random() * 2 - 1,
      },
    ];
    return newData;
  } else if (paramName == "volume") {
    const series = node.params.series[paramName];
    const data = series.data;
    const items = data.slice(0, data.length - 1);
    const lastItem = data[data.length - 1];
    if (!lastItem) return;
    let newData = [
      ...items,
      {
        ...lastItem,
        value: lastItem.value + Math.random() * 20,
      },
    ];
    return newData;
  } else if (paramName == "sma") {
    const series = node.params.series[paramName];
    const period = series.period;
    let newData = calculateSMA(node.params.series["ohlc"].data, period);
    const _s = node.params.series[paramName].data;
    const items = _s.slice(0, _s.length - 1);
    const lastItem = newData[newData.length - 1];
    if (!lastItem) return;
    newData = [
      ...items,
      {
        ...lastItem,
      },
    ];
    return newData;
  } else if (paramName == "rsi") {
    const series = node.params.series[paramName];
    const period = series.period;
    let newData = calculateRSI(node.params.series["ohlc"].data, period);
    const _s = node.params.series[paramName].data;
    const items = _s.slice(0, _s.length - 1);
    const lastItem = newData[newData.length - 1];
    if (!lastItem) return;
    newData = [
      ...items,
      {
        ...lastItem,
      },
    ];
    return newData;
  }
}
