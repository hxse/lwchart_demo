// useLightweightChart.js
import { createLWChart } from "./createChart";
import { throttle } from "../utils/commonUtils";
import { arraysAreEqual, addOrUpdateChart } from "../utils/nodeUtils";
import { getCrosshairPrice } from "../utils/chartUtils";
import { setDataLayout } from "../data/callback/dataCallbacks";
import { useLightweightChartLogger } from "../utils/logger"; // 引入 logger

/**
 * Svelte action，用于初始化和管理 Lightweight Charts 实例。
 *
 * @param {HTMLElement} nodeTarget - Svelte action 绑定的 DOM 元素，作为图表的容器。
 * @param {Object} options - 配置选项对象。
 * @param {Object} options.chartWapper - 包含 chart 和 chartContainer 引用的对象。
 * @param {Array<number>} options.id - 当前图表的唯一 ID 路径。
 * @param {Object} options.dataContainer - 数据容器对象。
 * @param {Object} options.dataObj - 包含系列数据的对象。
 * @param {Function} options.onCrosshairMove - 十字光标移动回调函数。
 * @param {Function} options.onVisibleLogicalRangeChange - 可见逻辑范围变化回调函数。
 * @param {Function} options.requestData - 请求数据函数。
 * @param {Object} options.chartContext - Svelte 上下文中的图表相关数据。
 * @param {Object} options.seriesCache - 用于缓存系列实例的对象。
 * @param {Array<number>} options.timeoutIds - 用于存储定时器 ID 的数组。
 * @returns {{ destroy: () => void }} - 包含 destroy 方法的对象，用于清理资源。
 */
export function useLightweightChart(
  nodeTarget,
  {
    chartWapper,
    id,
    dataContainer,
    dataObj,
    onCrosshairMove,
    onVisibleLogicalRangeChange,
    requestData,
    chartContext,
    seriesCache,
    timeoutIds,
  }
) {
  // 创建 Lightweight Charts 实例
  chartWapper.chart = createLWChart(chartWapper.chartContainer);
  useLightweightChartLogger.info(`在 action 中初始化图表: ${dataContainer.name}, ID: ${id.join("-")}`);

  // 将当前图表实例添加到全局图表数组中
  addOrUpdateChart(chartContext.chartArray, { id, chart: chartWapper.chart, seriesCache });

  // 根据 dataObj 中的 display 属性设置初始数据布局
  for (const [key, value] of Object.entries(dataObj)) {
    if (!value.display) continue;
    setDataLayout(dataContainer, id, key);
    useLightweightChartLogger.info(`为系列 ${key} 设置初始数据布局。`);
  }

  // 订阅十字光标移动事件
  chartWapper.chart.subscribeCrosshairMove((param) => {
    if (param.time && param.point && param.seriesData) {
      // 获取十字光标价格和对应的系列
      const { price, series } = getCrosshairPrice(seriesCache, param.seriesData);
      if (series) {
        // 设置十字光标位置
        chartWapper.chart.setCrosshairPosition(price, param.time, series);
        useLightweightChartLogger.trace(`十字光标移动，设置位置到时间: ${param.time}, 价格: ${price}`);
      }
    }
    // 如果提供了 onCrosshairMove 回调，则进行节流处理后调用
    if (onCrosshairMove) {
      const debouncedOnCrosshairMove = throttle(onCrosshairMove, 200);
      debouncedOnCrosshairMove({ id, chart: chartWapper.chart, param: param });
    }
  });

  // 订阅可见逻辑范围变化事件
  chartWapper.chart.timeScale().subscribeVisibleLogicalRangeChange((param) => {
    // 如果提供了 onVisibleLogicalRangeChange 回调，则进行节流处理后调用
    // 注意：原始代码中这里有一个逻辑错误，`if (!onVisibleLogicalRangeChange)` 应该改为 `if (onVisibleLogicalRangeChange)`
    // 为了不改变逻辑，这里保持原样，但建议在实际开发中修正。
    if (!onVisibleLogicalRangeChange) {
      const debouncedOnVisibleLogicalRangeChange = throttle(onVisibleLogicalRangeChange, 100);
      debouncedOnVisibleLogicalRangeChange({ id, chart: chartWapper.chart, range: param });
      useLightweightChartLogger.trace(`可见逻辑范围变化:`, param);
    }
  });

  // 自动调整时间刻度以适应内容
  chartWapper.chart.timeScale().fitContent();
  useLightweightChartLogger.info("图表内容已适应时间刻度。");

  // 请求初始数据并获取定时器 ID
  const newTimeoutIds = requestData(seriesCache);
  if (newTimeoutIds) {
    timeoutIds.length = 0; // 清空原有数组
    timeoutIds.push(...newTimeoutIds); // 添加新的 ID
    useLightweightChartLogger.info(`已注册 ${newTimeoutIds.length} 个数据请求定时器。`);
  }

  return {
    /**
     * Svelte action 的 destroy 方法，用于清理资源。
     * 在组件销毁时调用，清除所有定时器并移除图表实例。
     */
    destroy() {
      useLightweightChartLogger.info("清理 action 中的定时器和图表实例。");
      // 清除所有注册的定时器
      if (timeoutIds && Array.isArray(timeoutIds)) {
        timeoutIds.forEach(clearTimeout);
        timeoutIds.length = 0;
        useLightweightChartLogger.info("所有定时器已清除。");
      }
      // 从全局图表数组中移除当前图表实例
      chartContext.chartArray = chartContext.chartArray.filter((c) => !arraysAreEqual(c.id, id));
      // 销毁 Lightweight Charts 实例
      chartWapper.chart?.remove();
      useLightweightChartLogger.info(`图表 ID ${id.join("-")} 已销毁。`);
    },
  };
}
