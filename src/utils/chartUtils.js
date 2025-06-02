import { chartUtilsLogger } from "./logger"; // 引入 logger

/**
 * 从 seriesCache 和 seriesData 中获取十字光标价格和对应的系列。
 *
 * @param {Object} seriesCache - 图表系列缓存，键为系列名（如 "ohlc"），值为系列对象。
 * @param {Map} seriesData - Lightweight Charts 的 seriesData（Map 类型），存储了每个系列的数据。
 * @returns {{ price: number|undefined, series: Object|undefined }} - 包含价格和系列对象。
 *   优先返回 ohlc 系列的 close 价格；如果没有 ohlc 系列，则取第一个系列的 close 或 value 价格。
 *   如果无数据或无法获取价格，则返回 { price: undefined, series: selectedSeries }。
 */
export function getCrosshairPrice(seriesCache, seriesData) {
  // 优先选择 ohlc 系列
  let selectedSeries = seriesCache["ohlc"];
  let seriesKey = "ohlc";

  // 如果没有 ohlc 系列，选择第一个系列
  if (!selectedSeries) {
    const seriesEntries = Object.entries(seriesCache);
    if (seriesEntries.length === 0) {
      chartUtilsLogger.warn("无可用系列，无法获取十字光标价格。");
      return { price: undefined, series: undefined };
    }
    seriesKey = seriesEntries[0][0];
    selectedSeries = seriesEntries[0][1];
  }

  // 如果没有提供 seriesData，则无法获取价格
  if (!seriesData) {
    chartUtilsLogger.trace(`未提供 seriesData，无法获取系列 ${seriesKey} 的价格。`);
    return { price: undefined, series: selectedSeries };
  }

  // 获取系列数据
  const data = seriesData.get(selectedSeries);
  if (!data) {
    chartUtilsLogger.trace(`系列 ${seriesKey} 在当前时间点无数据。`);
    return { price: undefined, series: selectedSeries };
  }

  // 优先获取 close 属性（适用于 CandlestickSeries）
  if ("close" in data && data.close != null) {
    chartUtilsLogger.debug(`获取到系列 ${seriesKey} 的 close 价格: ${data.close}`);
    return { price: data.close, series: selectedSeries };
  }
  // 其次获取 value 属性（适用于 LineSeries、HistogramSeries）
  if ("value" in data && data.value != null) {
    chartUtilsLogger.debug(`获取到系列 ${seriesKey} 的 value 价格: ${data.value}`);
    return { price: data.value, series: selectedSeries };
  }

  // 无 close 也无 value
  chartUtilsLogger.trace(`系列 ${seriesKey} 的数据无 close 或 value 属性，无法获取价格。`);
  return { price: undefined, series: selectedSeries };
}
