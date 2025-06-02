<script>
  import RecursiveGrid from "./RecursiveGrid.svelte";
  import { dataWapper } from "./data/data.js";
  import { setContext } from "svelte";
  import { appLogger } from "./utils/logger"; // 引入 appLogger

  // 使用 Svelte 的 $state 响应式声明来包装 dataWapper，使其成为响应式数据容器
  // dataContainer 将作为整个应用的数据源，传递给子组件
  const dataContainer = $state(dataWapper);
  appLogger.debug("App.svelte: dataContainer 已初始化。", dataContainer);

  // 使用 Svelte 的 setContext API 设置一个上下文，名为 "chartContext"
  // 这个上下文将包含一个 chartArray，用于存储所有 Lightweight Charts 实例的引用
  // 这样，在组件树中的任何后代组件都可以通过 getContext("chartContext") 访问到这个数组
  setContext("chartContext", { chartArray: [] });
  appLogger.debug("App.svelte: chartContext 已设置。");
</script>

<!--
  RecursiveGrid 组件是应用程序的根组件，负责渲染整个网格布局。
  它接收 dataContainer 作为数据源，并从 dataContainer 中获取当前活动的节点数据。
-->
<RecursiveGrid {dataContainer} node={dataContainer[dataContainer["name"]]} />
