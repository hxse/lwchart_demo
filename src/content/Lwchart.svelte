<script>
  import { getContext } from "svelte";
  import { setDataLayout } from "../data/callback/dataCallbacks";
  import { createLWSeries } from "./createChart";
  import { shouldUpdateLastPoint } from "../data/compareData";
  import { useResizeObserver } from "./useResizeObserverAction.js";
  import { useLightweightChart } from "./useLightweightChart.js";
  import { lwchartLogger } from "../utils/logger"; // 引入 logger

  // 获取 Svelte 上下文中的图表相关数据
  const chartContext = getContext("chartContext");

  // 从父组件接收的 props
  let { dataContainer, node, id, dataObj, onCrosshairMove, onVisibleLogicalRangeChange, requestData } = $props();

  // 图表实例和容器的引用
  const chartWapper = { chart: undefined, chartContainer: undefined };
  // 用于存储上一次数据状态，以便进行数据比较和更新
  const previousDataObj = {};
  // 用于缓存 Lightweight Charts 的系列实例
  const seriesCache = {};
  // 用于存储 setTimeout/setInterval 的 ID，以便在组件销毁时清除
  const timeoutIds = [];

  // 容错值，用于避免图表容器出现滚动条
  const fault = 0.6;

  /**
   * 处理图表容器尺寸变化的函数。
   * 当容器尺寸变化时，调整图表大小以适应新尺寸。
   */
  const handleResize = () => {
    if (chartWapper.chartContainer && chartWapper.chart) {
      chartWapper.chart.resize(
        chartWapper.chartContainer.clientWidth - fault,
        chartWapper.chartContainer.clientHeight - fault
      );
      lwchartLogger.info(
        `图表尺寸已调整为 ${chartWapper.chartContainer.clientWidth - fault}x${chartWapper.chartContainer.clientHeight - fault}`
      );
    }
  };

  // Svelte effect: 响应 dataObj 中 display 属性的变化，添加或移除图表系列
  $effect(() => {
    lwchartLogger.info("触发 display effect，检查系列显示状态。");

    for (const [key, value] of Object.entries(dataObj)) {
      // 如果系列不应显示但已存在于缓存中，则移除该系列
      if (!value.display && seriesCache[key]) {
        chartWapper.chart.removeSeries(seriesCache[key]);
        lwchartLogger.info(`移除系列: ${key}`);
        delete seriesCache[key];
        // 清空之前的数据，确保下次显示时重新加载
        previousDataObj[key].data = [];
      }
      // 如果系列应显示但不在缓存中，则创建并添加该系列
      if (value.display && !seriesCache[key]) {
        const series = createLWSeries(chartWapper.chart, key, value.pIdx);
        seriesCache[key] = series;
        lwchartLogger.info(`添加系列: ${key}`);
      }
    }
  });

  // Svelte effect: 响应 dataObj 中数据内容的变化，更新图表数据
  $effect(() => {
    lwchartLogger.info("触发 data effect，检查数据更新。");
    for (const [key, value] of Object.entries(dataObj)) {
      // 如果系列不显示，则跳过
      if (!value.display) continue;

      const series = seriesCache[key];

      // 如果图表或系列未初始化，则无法更新
      if (!chartWapper.chart || !series) {
        lwchartLogger.warn(`图表或系列 ${key} 未准备好，跳过数据更新。`);
        return;
      }

      // 如果数据为空或不存在，请求更新数据布局
      if (!dataObj || !dataObj[key] || !dataObj[key].data || dataObj[key].data.length === 0) {
        lwchartLogger.info(`系列 ${key} 数据为空，请求更新数据布局。`);
        setDataLayout(dataContainer, node.id, key);
        return;
      }

      const newLength = dataObj[key].data.length;
      const oldLength = previousDataObj[key] && previousDataObj[key].data ? previousDataObj[key].data.length : 0;

      // 判断数据更新类型 (更新最后一个点或替换全部数据)
      const diff = shouldUpdateLastPoint(newLength, oldLength, dataObj, previousDataObj, key);
      if (diff === "last") {
        lwchartLogger.info(`更新系列 ${key} 的最后一个数据点，当前数据量: ${dataObj[key].data.length}`);
        const res = { ...dataObj[key].data[newLength - 1] };
        series.update(res);
      } else if (diff === "all") {
        lwchartLogger.info(`替换系列 ${key} 的全部数据，当前数据量: ${dataObj[key].data.length}`);
        series.setData([...dataObj[key].data]);
      } else {
        lwchartLogger.info(`系列 ${key} 无需更新数据，差异类型: ${diff}`);
      }

      // 更新 previousDataObj 以便下次比较
      if (!previousDataObj[key]) {
        previousDataObj[key] = {};
      }
      previousDataObj[key].data = dataObj[key].data;
    }
  });
</script>

<!-- 图表容器 div -->
<div
  bind:this={chartWapper.chartContainer}
  use:useLightweightChart={{
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
  }}
  use:useResizeObserver={handleResize}
  style="width: 100%; height: 100%;"
></div>
