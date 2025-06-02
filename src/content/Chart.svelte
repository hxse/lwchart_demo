<script>
  import Lwchart from "./Lwchart.svelte";
  import { getContext } from "svelte";
  import { arraysAreEqual } from "../utils/nodeUtils";
  import { setDataLayout, updateDataLayout } from "../data/callback/dataCallbacks";
  import { getCrosshairPrice } from "../utils/chartUtils";
  import { chartLogger } from "../utils/logger"; // 引入 logger

  // 获取 Svelte 上下文中的图表相关数据
  const chartContext = getContext("chartContext");

  // 从父组件接收的 props
  let { dataContainer, node } = $props();
  // 当前图表的唯一 ID
  const id = node.id;

  /**
   * 处理十字光标移动事件。
   * 当一个图表的十字光标移动时，同步其他图表的十字光标位置。
   *
   * @param {{ id: Array<number>, chart: Object, param: Object }} event - 十字光标事件对象。
   *   - id: 当前图表的 ID。
   *   - chart: 当前图表实例。
   *   - param: Lightweight Charts 提供的十字光标参数。
   */
  function handleCrosshair({ id, chart, param }) {
    // 过滤出除了当前图表之外的其他图表实例
    const otherCharts = chartContext.chartArray.filter((_c) => !arraysAreEqual(id, _c.id));

    if (param && param.time && param.point && param.seriesData) {
      // 如果十字光标在图表区域内，同步其他图表的十字光标位置
      chartLogger.trace(`十字光标在图表 ${id.join("-")} 移动到时间: ${param.time}`);
      for (let _c of otherCharts) {
        // 获取其他图表的十字光标价格（如果需要，这里可以根据实际需求调整获取逻辑）
        const res = getCrosshairPrice(_c.seriesCache, undefined); // 传入 undefined 表示不使用当前 param.seriesData
        _c.chart.setCrosshairPosition(undefined, param.time, res.series);
        chartLogger.trace(`同步图表 ${_c.id.join("-")} 的十字光标位置。`);
      }
    } else {
      // 如果十字光标离开图表区域，清除所有其他图表的十字光标
      chartLogger.trace(`十字光标离开图表 ${id.join("-")}，清除其他图表十字光标。`);
      for (let _c of otherCharts) {
        _c.chart.clearCrosshairPosition();
      }
    }
  }

  // 用于比较浮点数的微小误差
  const EPSILON = 0.00001;

  /**
   * 比较两个逻辑范围是否相等。
   *
   * @param {Object} range1 - 第一个逻辑范围对象。
   * @param {Object} range2 - 第二个逻辑范围对象。
   * @returns {boolean} - 如果两个范围的 from 和 to 值在误差范围内相等，则返回 true，否则返回 false。
   */
  function isEqual(range1, range2) {
    if (!range1 || !range2) {
      chartLogger.warn("比较逻辑范围时，存在无效范围对象。");
      return false;
    }
    return Math.abs(range1.from - range2.from) <= EPSILON && Math.abs(range1.to - range2.to) <= EPSILON;
  }

  /**
   * 处理可见逻辑范围变化事件。
   * 目前此函数为空，可以根据需求添加逻辑，例如同步其他图表的可见范围。
   *
   * @param {{ id: Array<number>, chart: Object, range: Object }} event - 可见逻辑范围变化事件对象。
   *   - id: 当前图表的 ID。
   *   - chart: 当前图表实例。
   *   - range: Lightweight Charts 提供的逻辑范围参数。
   */
  function handleVisibleLogicalRangeChange({ id, chart, range }) {
    chartLogger.trace(`图表 ${id.join("-")} 可见逻辑范围变化:`, range);
    // TODO: 根据需求添加同步其他图表可见范围的逻辑
    return;
  }

  /**
   * 请求数据并模拟数据更新。
   * 此函数包含两个定时器，分别用于模拟全量数据替换和增量数据更新。
   *
   * @param {Object} seriesCache - 图表系列缓存。
   * @returns {Array<number>} - 包含 setTimeout/setInterval ID 的数组，用于清理。
   */
  function requestData(seriesCache) {
    // 模拟首次加载，1秒后替换全部数据
    const initialTimeout = setTimeout(() => {
      chartLogger.info("模拟首次数据加载，开始替换全部数据。");
      for (const [key, series] of Object.entries(seriesCache)) {
        setDataLayout(dataContainer, node.id, key);
      }
    }, 1 * 1000);

    let updateInterval = null;
    let updateCount = 0;

    // 启动增量数据更新的函数
    const startUpdatingLastClose = () => {
      chartLogger.info("模拟增量数据更新，开始更新最后一个数据点。");
      updateInterval = setInterval(() => {
        if (updateCount < 2) {
          // 仅更新两次
          updateCount++;
          for (const [key, series] of Object.entries(seriesCache)) {
            updateDataLayout(dataContainer, node.id, key);
          }
          chartLogger.info(`增量更新第 ${updateCount} 次。`);
        } else {
          clearInterval(updateInterval);
          chartLogger.info("增量更新已停止。");
        }
      }, 1 * 1000);
    };

    // 模拟第二次数据更新，2秒后开始增量更新
    const secondTimeout = setTimeout(() => {
      startUpdatingLastClose();
    }, 2 * 1000);

    return [initialTimeout, secondTimeout];
  }
</script>

<!-- 图表容器，包含 Lightweight Charts 组件 -->
<div style="width: 100%; height: 100%;">
  <Lwchart
    {dataContainer}
    {node}
    {id}
    dataObj={node.params.series}
    onCrosshairMove={handleCrosshair}
    onVisibleLogicalRangeChange={handleVisibleLogicalRangeChange}
    {requestData}
  />
</div>
