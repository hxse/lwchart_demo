import { processNodesForGrid } from "../utils/gridUtils";
import { createSeries } from "./data";

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
          params: { text: "点击切换布局2", callback: "updateParentLayout" },
        },
        {
          content: "hello_world",
          params: { text: "点击切换数据2", callback: "updateParentLayout2" },
        },
        { content: "hello_world", params: { text: "点击隐藏指标2", callback: "changeDataLayout", paramName: "sma" } },
        { content: "hello_world", params: { text: "点击切换周期2", callback: "changeDataPeriod", paramName: "sma" } },
        { content: "hello_world", params: { text: "点击刷新图表2", callback: "changeDataRefresh" } },
        { content: "hello_world", params: { text: "hello_world2" } },
      ],
    },
    {
      gridTemplateAreas: `"0 1" "2 3"`,
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
        {
          content: "lwchart",
          params: { series: createSeries() },
        },
      ],
    },
  ],
};

// originData = addIds(originData, [0]);
export const originData2 = processNodesForGrid(data, [0], "data");
console.log("originData", originData2);
