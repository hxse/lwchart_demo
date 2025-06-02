import { processNodesForGrid } from "../utils/gridUtils";
import { originData2 } from "./data2";

export function createSeries() {
  return {
    ohlc: {
      data: [],
      count: 30,
      display: true,
      pIdx: 0,
      redraw: false,
    },
    volume: {
      data: [],
      display: true,
      pIdx: 0,
      redraw: false,
    },
    sma: {
      data: [],
      period: 14,
      display: true,
      pIdx: 0,
      redraw: false,
    },
    rsi: {
      data: [],
      period: 14,
      display: true,
      pIdx: 1,
      redraw: false,
    },
  };
}

// 原始数据，不包含 id
let data = {
  gridTemplateAreas: `"0" "1"`,
  gridTemplateRows: "10% 90%",
  gridTemplateColumns: "100%",
  children: [
    {
      gridTemplateAreas: `"0 1 2" "3 4 5"`,
      gridTemplateRows: "50% 50%",
      gridTemplateColumns: "35% 35% 30%",
      children: [
        {
          content: "hello_world",
          params: { text: "点击切换布局", callback: "updateParentLayout" },
        },
        {
          content: "hello_world",
          params: { text: "点击切换数据", callback: "updateParentLayout2" },
        },
        { content: "hello_world", params: { text: "点击隐藏指标", callback: "changeDataLayout", paramName: "sma" } },
        { content: "hello_world", params: { text: "点击切换周期", callback: "changeDataPeriod", paramName: "sma" } },
        { content: "hello_world", params: { text: "点击刷新图表", callback: "changeDataRefresh" } },
        { content: "hello_world", params: { text: "hello_world" } },
      ],
    },
    {
      gridTemplateAreas: `"0 1" "0 2"`,
      gridTemplateRows: "50% 50%",
      gridTemplateColumns: "50% 50%",
      children: [
        {
          content: "lwchart",
          params: { series: createSeries() },
        },
        {
          content: "lwchart",
          params: { series: createSeries() },
        },
        {
          content: "lwchart",
          params: { series: createSeries() },
        },
      ],
    },
  ],
};

// originData = addIds(originData, [0]);
export const originData = processNodesForGrid(data, [0], "data");
console.log("originData", originData);

export const dataWapper = { name: "data", data: originData, data2: originData2 };
